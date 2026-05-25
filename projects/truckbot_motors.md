
The truckbot uses four [FIT0186 motors](https://www.digikey.com/short/144zn5cn):

<div style="text-align:center; margin: 1.5rem 0;">
	<img src="../images/FIT0186.png.png" alt="FIT0186 Motor" style="width: 80%;" />
</div>

- Gear ratio: 43.8:1
- No-load speed: 251 + 10% RPM
- No-load current: 350 mA
- Start Voltage: 1.0 V
- Stall Torque: 18 Kg.com
- Stall Current: 7 A
- Insulation resistance: 20 M Ω
- EncoderOperating Voltage: 5 V
- Encoder type: Hall
- Encoder Resolution: 16CPR(motor shaft)/700CPR(gearbox shaft)
- Weight: 205g

## Reading the Encoders

Each motor contain quadrature encoders. The encoder is getting power from the 5V rail on the pi and getting read via two GPIO pins on the pi as well. By reading the voltage transitions on the pi, we can count how many ticks the encoder has turned, from the [source code](https://github.com/emory-ducote/truckbot/blob/60c08c0ceb4e2999cb8607cf415aae438494dc13/src/control/src/EncoderDriver.cpp#L46-L60):

First we read the GPIO pins, assigning pinA as our most significant bit (MSB) and pinB as our least signicant bit (LSB).
```
void EncoderDriver::handleEdgeChange()
{
    int MSB = lgGpioRead(handle, pinA);
    int LSB = lgGpioRead(handle, pinB);
```

We then shift our MSB one to the left and OR it with our LSB, storing it in `encoded`. For example, if our MSB was `1` and our LSB was `0`, this would result in an `currentEncoderRead` value of `0x10`.
```
    int currentEncoderRead = (MSB << 1) | LSB;
```

Then, we take our value from the previous reading, `lastEncoderRead`, shift it 2 to the left and OR it with our new value. Using our previous `encoded` example, if the previous reading was `0x11`, this would result in a `sum` of `0x1110`.
```
    int encoderEdgeChange = (lastEncoderRead << 2) | currentEncoderRead;
```

Now we have some idea of when we *just measured* and what was  *previously measured*. Using the properties of the hall quadrature encoder, we can now decode into encoder counts in a given direction. 

The encoder typical output looks like the [time series](https://www.google.com/url?sa=t&source=web&rct=j&url=http%3A%2F%2Fmakeatronics.blogspot.com%2F2013%2F02%2Fefficiently-reading-quadrature-with.html&ved=0CBYQjRxqFwoTCPDMzYmT05QDFQAAAAAdAAAAABBW&opi=89978449) below:
![[encoder_signals.png]]

This [truth table](https://www.google.com/url?sa=t&source=web&rct=j&url=http%3A%2F%2Fmakeatronics.blogspot.com%2F2013%2F02%2Fefficiently-reading-quadrature-with.html&ved=0CBYQjRxqFwoTCODluaOS05QDFQAAAAAdAAAAABAF&opi=89978449) maps that property into a direction / count:
![[encoder_truth_table.png]]

Now given we have our `encoderEdgeChange` containing the old and new values, we can add or decrement the encoder counts accordingly:
```
    if (encoderEdgeChange == 0b1101 || encoderEdgeChange == 0b0100 || encoderEdgeChange == 0b0010 || encoderEdgeChange == 0b1011)
        encoderTicks++;
    else if (encoderEdgeChange == 0b1110 || encoderEdgeChange == 0b0111 || encoderEdgeChange == 0b0001 || encoderEdgeChange == 0b1000)
        encoderTicks--;

    lastEncoderRead = currentEncoderRead;
}
```

The full function:
```
void EncoderDriver::handleEdgeChange()
{
    int MSB = lgGpioRead(handle, pinA);
    int LSB = lgGpioRead(handle, pinB);

    int currentEncoderRead = (MSB << 1) | LSB;
    int encoderEdgeChange = (lastEncoderRead << 2) | currentEncoderRead;

    if (encoderEdgeChange == 0b1101 || encoderEdgeChange == 0b0100 || encoderEdgeChange == 0b0010 || encoderEdgeChange == 0b1011)
        encoderTicks++;
    else if (encoderEdgeChange == 0b1110 || encoderEdgeChange == 0b0111 || encoderEdgeChange == 0b0001 || encoderEdgeChange == 0b1000)
        encoderTicks--;

    lastEncoderRead = currentEncoderRead;
}
```

Now we have an encoder count, but what does that really mean? From our motor specs we can see that at the gearbox shaft output is rated for 700 CPR (counts per revolution).  So 700 counts will accrue across one full rotation of the motor. Now, what defines a full count?

A full count for a quadrature encoder is made of:
`00 → 01 → 11 → 10 → 00`
equivalent to 4 `encoderTicks`'s. 

So to go from encoder ticks to motor shaft rotations, we divide by the `CPR * ticks per count`
`ticks / (CPR * ticks per count)`

From the [source code](https://github.com/emory-ducote/truckbot/blob/d813ef681b5e30e45ca81086c19ae69f53e4584d/src/control/src/EncoderDriver.cpp#L62-L70):

Given a `dt` (sampling rate), we can calculate the difference in encoder ticks over that time period and divide at like described. This gives us a value in unit `rotations`
```
float EncoderDriver::getWheelSpeeds(float dt)
{
    float rotations = static_cast<float>(encoderTicks - lastEncoderTicks) 
                                      / (encoderCPR * encoderTicksPerRevolution);
```

Then we convert that rotation count to `rad/s` by multiplying by 2pi and dividing by `dt`:
```
    float omega  = (rotations * 2.0 * M_PI) / dt; // rad/s
```

To get the velocity, we multiply by our wheel radius:
```
	float vel = omega  * wheelRadius; // m/s
```

The full function:
```
float EncoderDriver::getWheelSpeeds(float dt)
{
    float rotations = static_cast<float>(encoderTicks - lastEncoderTicks) 
                                      / (encoderCPR * encoderTicksPerRevolution);
    float omega  = (rotations * 2.0 * M_PI) / dt; // rad/s
    float vel = omega  * wheelRadius; // m/s
    lastEncoderTicks = encoderTicks;
    return vel;
}
```


