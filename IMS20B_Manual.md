# IMS20B-AUL Series Small-Power Servo Motor User Manual

**SHENZHEN INVT ELECTRIC CO., LTD.**

## Preface

**Overview**
Thank you for purchasing the IMS20B-AUL series small-power servo motor.
IMS20B-AUL series small-power servo motor is a newly developed motor product by our company, covering a power range of 0.05kW-7.5kW, with frame sizes from 40 to 180. It offers various inertia configurations and speed ranges, and different types of encoders can be configured according to customer requirements.
This product is suitable for the general automation industry, working with servo drives to achieve high-speed, high-precision control of position, speed, and torque.

**Readers**
Personnel with electrical professional knowledge (such as qualified electrical engineers or personnel with equivalent knowledge).

**Change history**
* V1.0 - March 2026 - First release.

---

## 1 Safety Precautions

### 1.1 Safety Declaration
Read this manual carefully and follow all safety precautions before moving, installing, wiring, operating and servicing the product. Otherwise, equipment damage or physical injury or death may be caused.

**Safety level definition:**
* **Danger:** Severe personal injury or even death can result if related requirements are not followed.
* **Warning:** Personal injury or equipment damage can result if related requirements are not followed.

### 1.2 Personnel Requirements
Trained and qualified professionals: People operating the equipment must have received professional electrical and safety training and obtained the certificates.

### 1.3 Safety Guidelines
* **Unpacking inspection:** Ensure packaging is intact. Handle with care. Confirm components and nameplate.
* **Delivery:** Securely install during transport. Do not move by pulling cables or shaft.
* **Installation:** Ensure mechanical strength. Do not disassemble components. Cover product to prevent metal shavings from entering.
* **Wiring:** Install overcurrent/leakage protectors. Match AC power supply voltage. Ground properly. Check cable integrity.
* **Check before power-on:** Ensure correct wiring and no personnel lingering around. Secure the key.
* **Running:** De-couple motor load for trial operation. Do not touch conductive parts. Do not touch high-temperature heat sinks. Wait 15 mins after power off to rewire.
* **Maintenance and repair:** Non-professionals are strictly prohibited from maintaining equipment. Do not maintain while powered on.
* **Scrapping:** Contains heavy metals. Treat as industrial waste according to national regulations.

### 1.4 Warning Symbols
* Caution: high temperature on the motor surface!
* Caution: risk of electric shock!
* Do not strike the motor shaft extension!

---

## 2 Motor Model Selection

### Frame Size 40 & 60 (Examples)
| Output power | Frame size | Motor model | Brake | Encoder | Rated voltage | Compatible drive |
|---|---|---|---|---|---|---|
| 0.05kW | 40 | IMS20B-04L05B30C-2-M41-AUL | - | 17-bit magnetic | 1PH/3PH 220V | DA200A-*-2R8-S-2-* |
| 0.1kW | 40 | IMS20B-04L10B30C-2-P91-AUL | - | 23-bit optical | 1PH/3PH 220V | DA200A-*-2R8-S-2-* |
| 0.2kW | 60 | IMS20B-06M20B30C-2-M4-AUL | - | 17-bit magnetic | 1PH/3PH 220V | DA200A-*-2R8-S-2-* |
| 0.4kW | 60 | IMS20B-06M40B30C-4-P94-AUL | Electromagnetic brake | 23-bit optical | 3PH 380V | DA200A-*-1R6-T-2-* |

*(Note: The full series covers models from 40 frame (0.05kW) to 180 frame (7.5kW) with varying configurations of 17-bit magnetic/23-bit optical encoders, brakes, and 220V/380V voltage classes.)*

---

## 3 Common Terms

### 3.1 Duty
**S1 duty: Continuous duty**
Operate under a constant load until reaching thermal stability.

### 3.2 Ingress Protection (IP) Rating
* **First digit:** Protection against solid objects (e.g., 6 = Total protection against ingress of any dust).
* **Second digit:** Protection against water (e.g., 7 = Protection against ingress of water under defined conditions of pressure and time).

### 3.3 Rated Parameters
* **Rated power:** Continuous operating power under specified conditions.
* **Rated speed:** Rotational speed when outputting rated power at rated voltage/frequency.
* **Rated torque:** Output torque at thermal steady state, rated power, and rated speed.
* **Rated current:** Current when operating under rated conditions at thermal steady state.

---

## 4 Product Overview

### 4.1 Product Features
* Comprehensive motor model (40 to 180 frame sizes, 0.05kW to 7.5kW).
* Excellent motor performance with strong overload capacity.
* High control precision (17-bit and 23-bit absolute encoders).

### 4.2 Model and Nameplate
**Product Model Example: IMS20B-06 M 40B 30C-4-P9 4 - AUL**
* `IMS20B`: Product category
* `06`: Frame size 60
* `M`: Medium inertia
* `40B`: Rated power (0.4kW)
* `30C`: Rated speed (3000rpm)
* `4`: Voltage class (380V)
* `P9`: Encoder type (23-bit multi-turn absolute optical)
* `4`: Optional part (With oil seal and electromagnetic brake)
* `AUL`: Internal vendor code

### 4.3 Product Components
* **40/60/80 Frame Motors:** Encoder terminal, Power cable terminal, Mounting screw through hole, Mounting flange surface, Shaft extension (with key). AMP flying lead terminal block available.
* **100/130/180 Frame Motors:** Encoder aviation connector, Power cable aviation connector, Mounting screw through hole, Mounting flange surface, Shaft extension.

---

## 5 General Specifications

### 5.1 Mechanical Characteristics
* **Duty:** S1 continuous
* **Running environment temp:** -20°C to 40°C
* **Storage temp:** -20°C to +60°C
* **Running humidity:** 20%-80% RH (no condensation)
* **Vibration:** 49m/s²
* **Impact:** 490m/s²
* **Exciting method:** Permanent magnetic
* **Installation:** IMB5 (flange-mounted)
* **Insulation class:** F
* **Enclosure IP rating:** IP67 (excluding shaft extension)
* **Altitude:** Below 1000m (Derating required above 1000m)

### 5.2 Derating Characteristics
* Derating required due to altitude (gradual drop after 1000m to 5000m).
* Derating required due to temperature (gradual drop from 40°C to 60°C).
* Derating required based on heat sink dimensions for different frame sizes.

---

## 6 Small-Power Servo Motor Specifications

### 6.1 Frame Size 40
* **Rated power:** 0.05kW / 0.1kW
* **Rated torque:** 0.16 N.m / 0.32 N.m
* **Rated speed:** 3000 rpm (Max 7000 rpm)
* **Rated current:** 1.2 A

### 6.2 Frame Size 60
* **Rated power:** 0.2kW / 0.4kW
* **Rated torque:** 0.64 N.m / 1.27 N.m
* **Rated speed:** 3000 rpm (Max 7000 rpm)
* **Rated current:** 1.4 A (220V) / 1.1 A (380V)

### 6.3 Frame Size 80
* **Rated power:** 0.75kW / 1kW
* **Rated torque:** 2.39 N.m / 3.18 N.m
* **Rated speed:** 3000 rpm (Max 7000 rpm)
* **Rated current (0.75kW):** 4.8 A (220V) / 2.8 A (380V)

### 6.4 Frame Size 100
* **Rated power:** 1kW / 1.5kW / 2kW / 2.5kW
* **Rated torque:** 3.2 N.m to 8 N.m
* **Rated speed:** 3000 rpm (Max 6000 rpm)

### 6.5 Frame Size 130
* **Rated power:** 0.85kW to 5kW
* **Rated torque:** 4.8 N.m to 15.9 N.m
* **Rated speed:** 1500 rpm / 2000 rpm / 3000 rpm (Max 3000-6000 rpm depending on model)

### 6.6 Frame Size 180
* **Rated power:** 3kW / 4.4kW / 5.5kW / 7.5kW
* **Rated torque:** 19.1 N.m to 47.8 N.m
* **Rated speed:** 1500 rpm (Max 4500 rpm)

---

## 7 Motor Terminal Description

### 7.1.1 40/60/80 Frame Terminal
* **Encoder Terminal:** Pin 1 (SD+), Pin 2 (SD-), Pin 3 (BAT+), Pin 4 (BAT-), Pin 5 (5V+), Pin 6 (0V), Pin 7 (GND).
* **Power Terminal (with brake):** Pin 1 (V), Pin 2 (U), Pin 3 (W), Pin 4 (PE), Pin A (24VDC), Pin B (0V).
* **Power Terminal (without brake):** Pin 1 (V), Pin 2 (U), Pin 3 (W), Pin 4 (PE).

### 7.1.2 100/130/180 Frame Terminal
* **Encoder Aviation Connector:** Pin A (SD+), Pin B (SD-), Pin E (VB+), Pin F (VB-), Pin G (+5V), Pin H (GND), Pin J (PE).
* **Power Terminal (with brake):** Pin A/C (W/U), Pin B (V), Pin D (PE), Pin 1 (24VDC), Pin 2 (0V).

---

## 8 Installation Instructions

### 8.1 Unpacking Inspection
Check for package damage, moisture, deformation. Verify enclosure, parts, and nameplate.

### 8.2 Mechanical Installation
* **Safety:** Ensure power is disconnected.
* **Environment:** Temp -20°C to 40°C, Humidity < 60% in corrosive environments. No sudden temperature changes. Install indoors away from direct sunlight, dust, and corrosive gases.
* **Direction:** Horizontal or vertical (bearing must face downwards to prevent oil ingress).
* **Mounting Method:** Clear area, ensure center axis alignment. Secure with bolts without striking the motor.

### 8.3 Electrical Installation
Connect power cables and encoder cables from drive side X1 to motor side X2. Ensure shielding and grounding are correct per DA200A Series AC Servo Drive User Manual.

### 8.4 Check After Installation
* Ambient temperature < 40°C, RH < 90%.
* Vibration < 0.5G. No dust/oil.
* Reliable mechanical connections.
* Motor is properly grounded.
* External terminal (SON) is OFF initially.

---

## 9 Common Faults

| Fault | Possible Cause | Solution |
|---|---|---|
| Motor not operating | Power/Encoder cable disconnected, Drive fault | Check wiring, inspect drive output. |
| Motor power-on overspeed | Overload, initial angle not recognized, high gain | Reduce load, reinitialize angle, adjust gain. |
| Abnormal noise | Friction in brake pads, foreign object, damaged bearing | Contact supplier/technician. |
| Motor operation vibration | Encoder feedback abnormal, loose encoder, high gain | Check shielding/grounding, adjust gain. |
| Reverse rotation | Incorrect rotation setting | Check rotation setting in drive. |
| Motor overheating | Abnormal heat dissipation, overload | Clear obstructions, reduce load. |
| Brake not responding | Faulty brake, incorrect voltage, worn pads | Contact technician, check voltage, replace motor. |

---

## 10 Certification Categories and Standards

* **CE Certification:** EMC Directive (2014/30/EU), LVD (2014/35/EU).
* **UL Certification:** UL 1004-1, UL 1004-6, CSA C22.2 No. 100.
* **Energy Efficiency:** China Energy Efficiency Certification (GB 30253-2024).
