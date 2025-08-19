During the initial months of the COVID pandemic, I discovered the art of making nixie clocks in a youtube video. With lots of time on my hands in between semesters, I decided to design a PCB and housing, having taken a circuit design course in my previous semester.

### Tube Selection

With a large variety of [Nixie Tubes](https://en.wikipedia.org/wiki/Nixie_tube) available, I decided on IN-14s as a moderate sized tube for a clock.

<div style="display:flex; justify-content:center; align-items:center; gap:1rem; margin-top:1.5rem;">
  <div style="text-align:center;">
    <img src="../images/in14.jpg" alt="IN-14 Nixie Tube" style="width:50%;" />
    <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">IN-14 Nixie Tube</div>
  </div>
  <div style="text-align:center;">
    <img src="../images/nixie_datasheet.png" alt="IN-14 Pinout" style="width:80%;" />
    <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">IN-14 Pinout</div>
  </div>
</div>

### Tube and Driver Pinouts

The pinout for these is pretty straightforward, with individual pins controlling indvidual digit. Connecting the digit pin to ~170 V and the anode pin to ground results in that digit lighting up.

<div style="text-align:center; margin: 1.5rem 0;">
  <img src="../images/nixie_lit.jpg" alt="Nixie Tube Lit" style="width:20%;" />
</div>

Adding a driver to handle the decoding makes things easier. I opted for the K155ID1 BCD-to-Decimal decoder. Using the provided truth table, enabling different numbers is simple.

<div style="display:flex; justify-content:center; align-items:center; gap:2rem; margin-top:1.5rem;">
  <div style="text-align:center;">
    <img src="../images/nixie_driver_function_table.png" alt="K155ID1 Truth Table" style="width:50%;" />
    <div style="font-size:1.05rem; color:#444; margin-top:0.4rem;">K155ID1 Truth Table</div>
  </div>
  <div style="text-align:center;">
    <img src="../images/nixie_driver.gif" alt="K155ID1 Pinout" style="width:80%;" />
    <div style="font-size:1.05rem; color:#444; margin-top:0.4rem;">K155ID1 Pinout</div>
  </div>
</div>

Sidenote, these tubes require high voltages ~170V to excite the gases inside. I am using a NCH8200HV DC-DC converter to step 12V up to the 170V necessary to power the tubes. 

### Circuit Control

For pin control, I opted to use an arduino nano for its small form-factor and ease-of-use. Combining the arduino, the NCH8200HV, a K155ID1, and a 12V DC power supply - I started with some testing on a breaboard setup. In addition to the IN-14 I also added a smaller dotlike tube to separate the digits of the clock. With this setup I tested cycling through digits.

<div style="text-align:center; margin: 2rem 0;">
  <img src="../images/single_nixie_sequence.gif" alt="Single Nixie Sequence" style="width:60%;" />
  <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">Single Nixie + Dot</div>
</div>

### Testing

After checking out this single tube setup, I went ahead with testing a 6-digit clock + dot separator setup. After some tedious wiring, I was able to get the system working.

<div style="text-align:center; margin: 2rem 0;">
  <img src="../images/nixie.gif" alt="Nixie GIF" style="width:60%;" />
  <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">6-Digits + Dots</div>
</div>

### Final Touches

To round out the circuit, I added a TINY RTC clock module to keep time in between power cycles. then I designed a PCB to put it all together.

<div style="text-align:center; margin: 2rem 0;">
  <img src="../images/nixie_pcb.png" alt="Nixie PCB" style="width:100%;" />
  <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">PCB Design</div>
</div>

After having the board manufactered, I soldered everything together I cut and finished a housing out of some wood we had laying around in the garage.

<div style="text-align:center; margin: 2rem 0;">
  <img src="../images/final_clock.png" alt="Final Nixie Clock" style="width:100%;" />
  <div style="font-size:1.1rem; color:#444; margin-top:0.5rem;">Final Clock</div>
</div>


