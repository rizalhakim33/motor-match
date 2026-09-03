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

*(Note: The data in parentheses in the tables below refers to the brake motor specifications.)*

### 6.1 Frame Size 40
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-04L05B30C-2-****-AUL | 220 | 40 | 250 | 0.05 | 0.16 | 0.56 | 3000 | 7000 | 1.2 | 4.8 | 0.018 (0.021) | 0.4 (0.45) |
| IMS20B-04L10B30C-2-****-AUL | 220 | 40 | 250 | 0.1 | 0.32 | 1.12 | 3000 | 7000 | 1.2 | 4.8 | 0.033 (0.036) | 0.5 (0.55) |
| IMS20B-04M05B30C-2-****-AUL | 220 | 40 | 250 | 0.05 | 0.16 | 0.56 | 3000 | 7000 | 1.2 | 5.3 | 0.034 (0.037) | 0.4 (0.45) |
| IMS20B-04M10B30C-2-****-AUL | 220 | 40 | 250 | 0.1 | 0.32 | 1.12 | 3000 | 7000 | 1.2 | 4.8 | 0.064 (0.067) | 0.5 (0.55) |

### 6.2 Frame Size 60
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-06M20B30C-2-****-AUL | 220 | 60 | 250 | 0.2 | 0.64 | 2.24 | 3000 | 7000 | 1.4 | 4.6 | 0.28 (0.31) | 0.765 (1.03) |
| IMS20B-06M20B30C-4-****-AUL | 380 | 60 | 250 | 0.2 | 0.64 | 2.24 | 3000 | 7000 | 1.1 | 3.6 | 0.28 (0.31) | 0.765 (1.03) |
| IMS20B-06M40B30C-2-****-AUL | 220 | 60 | 250 | 0.4 | 1.27 | 4.45 | 3000 | 7000 | 1.6 | 5.3 | 0.5 (0.53) | 1.135 (1.4) |
| IMS20B-06M40B30C-4-****-AUL | 380 | 60 | 250 | 0.4 | 1.27 | 4.45 | 3000 | 7000 | 1.6 | 5.3 | 0.5 (0.53) | 1.135 (1.4) |

### 6.3 Frame Size 80
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-08M75B30C-2-****-AUL | 220 | 80 | 250 | 0.75 | 2.39 | 8.36 | 3000 | 7000 | 4.8 | 16 | 1.7 (1.74) | 2.14 (2.7) |
| IMS20B-08M75B30C-4-****-AUL | 380 | 80 | 250 | 0.75 | 2.39 | 8.36 | 3000 | 7000 | 2.8 | 9.3 | 1.7 (1.74) | 2.14 (2.7) |
| IMS20B-08M10C30C-2-****-AUL | 220 | 80 | 250 | 1 | 3.18 | 11.14 | 3000 | 7000 | 5.5 | 19 | 2.2 (2.24) | 2.62 (3.18) |
| IMS20B-08M10C30C-4-****-AUL | 380 | 80 | 250 | 1 | 3.18 | 11.14 | 3000 | 7000 | 3.5 | 11.7 | 2.2 (2.24) | 2.62 (3.18) |

### 6.4 Frame Size 100
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-10M10C30C-2-****-AUL | 220 | 100 | 250 | 1 | 3.2 | 9.6 | 3000 | 6000 | 5.9 | 19.7 | 1.71 (1.87) | 3.4 (4.2) |
| IMS20B-10M10C30C-4-****-AUL | 380 | 100 | 250 | 1 | 3.2 | 9.6 | 3000 | 6000 | 3 | 10 | 1.71 (1.87) | 3.4 (4.2) |
| IMS20B-10M15C30C-2-****-AUL | 220 | 100 | 250 | 1.5 | 4.8 | 14.3 | 3000 | 6000 | 7.8 | 29.3 | 2.36 (2.53) | 4.2 (5) |
| IMS20B-10M15C30C-4-****-AUL | 380 | 100 | 250 | 1.5 | 4.8 | 14.3 | 3000 | 6000 | 4 | 14 | 2.36 (2.53) | 4.2 (5) |
| IMS20B-10M20C30C-2-****-AUL | 220 | 100 | 250 | 2 | 6.4 | 19.1 | 3000 | 6000 | 11.1 | 36.8 | 3.03 (3.2) | 5 (5.8) |
| IMS20B-10M20C30C-4-****-AUL | 380 | 100 | 250 | 2 | 6.4 | 19.1 | 3000 | 6000 | 5.5 | 17.1 | 3.03 (3.2) | 5 (5.8) |
| IMS20B-10M25C30C-4-****-AUL | 380 | 100 | 250 | 2.5 | 8 | 23.9 | 3000 | 6000 | 7.1 | 22.5 | 3.68 (3.85) | 5.8 (6.6) |

### 6.5 Frame Size 130
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-13H85B15C-2-****-AUL | 220 | 130 | 125 | 0.85 | 5.4 | 13.5 | 1500 | 4500 | 6.2 | 14.9 | 13.1 (14.3) | 5.7 (7.3) |
| IMS20B-13H85B15C-4-****-AUL | 380 | 130 | 125 | 0.85 | 5.4 | 13.5 | 1500 | 4500 | 3.3 | 8.3 | 13.1 (14.3) | 5.7 (7.3) |
| IMS20B-13H13C15C-2-****-AUL | 220 | 130 | 125 | 1.3 | 8.3 | 20.7 | 1500 | 4500 | 9.9 | 24.8 | 17.9 (19.1) | 7.2 (8.8) |
| IMS20B-13H13C15C-4-****-AUL | 380 | 130 | 125 | 1.3 | 8.3 | 20.7 | 1500 | 4500 | 5.2 | 12.6 | 17.9 (19.1) | 7.2 (8.8) |
| IMS20B-13H18C15C-2-****-AUL | 220 | 130 | 125 | 1.8 | 11.5 | 28.7 | 1500 | 4500 | 12.8 | 31.1 | 24.3 (25.6) | 9 (10.6) |
| IMS20B-13H18C15C-4-****-AUL | 380 | 130 | 125 | 1.8 | 11.5 | 28.7 | 1500 | 4500 | 7.7 | 17.8 | 24.3 (25.6) | 9 (10.6) |
| IMS20B-13H23C30C-2-****-AUL | 220 | 130 | 250 | 2.3 | 7.3 | 21.9 | 3000 | 5000 | 11.9 | 32.6 | 17.9 (19.1) | 7.2 (8.8) |
| IMS20B-13H23C30C-4-****-AUL | 380 | 130 | 250 | 2.3 | 7.3 | 21.9 | 3000 | 5000 | 6.8 | 19.2 | 17.9 (19.1) | 7.2 (8.8) |
| IMS20B-13M10C20C-2-****-AUL | 220 | 130 | 167 | 1 | 4.8 | 14.3 | 2000 | 4500 | 5.4 | 16.9 | 6.3 (7.95) | 4.4 (6) |
| IMS20B-13M10C20C-4-****-AUL | 380 | 130 | 167 | 1 | 4.8 | 14.3 | 2000 | 4500 | 3 | 8.6 | 6.3 (7.95) | 4.4 (6) |
| IMS20B-13M15C20C-2-****-AUL | 220 | 130 | 167 | 1.5 | 7.2 | 21.5 | 2000 | 4500 | 7.6 | 22.2 | 9.1 (10.8) | 5.6 (7.2) |
| IMS20B-13M15C20C-4-****-AUL | 380 | 130 | 167 | 1.5 | 7.2 | 21.5 | 2000 | 4500 | 4.8 | 13.4 | 9.1 (10.8) | 5.6 (7.2) |
| IMS20B-13M20C20C-2-****-AUL | 220 | 130 | 167 | 2 | 9.6 | 28.7 | 2000 | 4500 | 9 | 27.8 | 12.9 (14.6) | 6.9 (8.5) |
| IMS20B-13M20C20C-4-****-AUL | 380 | 130 | 167 | 2 | 9.6 | 28.7 | 2000 | 4500 | 5.6 | 15.9 | 12.9 (14.6) | 6.9 (8.5) |
| IMS20B-13M30C20C-2-****-AUL | 220 | 130 | 167 | 3 | 14.3 | 43 | 2000 | 3000 | 13 | 37.5 | 21.7 (23.4) | 10.3 (11.9) |
| IMS20B-13M30C20C-4-****-AUL | 380 | 130 | 167 | 3 | 14.3 | 43 | 2000 | 3000 | 7.7 | 21.1 | 21.7 (23.4) | 10.3 (11.9) |
| IMS20B-13L30C30C-4-****-AUL | 380 | 130 | 150 | 3 | 9.6 | 28.7 | 3000 | 6000 | 8.8 | 27 | 6.89 (8.13) | 9.8 (11.5) |
| IMS20B-13L40C30C-4-****-AUL | 380 | 130 | 150 | 4 | 12.7 | 38.2 | 3000 | 6000 | 14 | 41.1 | 9.89 (11.13) | 12.8 (14.5) |
| IMS20B-13L50C30C-4-****-AUL | 380 | 130 | 150 | 5 | 15.9 | 47.8 | 3000 | 6000 | 17.6 | 48.2 | 12.9 (14.14) | 15.8 (17.5) |

### 6.6 Frame Size 180
| Product model | Rated voltage (V) | Frame size (mm) | Running frequency (Hz) | Rated power (kW) | Rated torque (N.m) | Peak torque (N.m) | Rated speed (rpm) | Max. speed (rpm) | Rated current (A) | Peak current (A) | Inertia value (kg.cm²) | Motor weight (kg) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IMS20B-18M30C15C-4-****-AUL | 380 | 180 | 100 | 3 | 19.1 | 47.8 | 1500 | 4500 | 9.7 | 22 | 48.6 (49.3) | 19.2 (21.2) |
| IMS20B-18M44C15C-4-****-AUL | 380 | 180 | 100 | 4.4 | 28 | 70 | 1500 | 4500 | 13.5 | 29.8 | 65.2 (65.9) | 23.2 (25.2) |
| IMS20B-18M55C15C-4-****-AUL | 380 | 180 | 100 | 5.5 | 35 | 88.8 | 1500 | 4500 | 16.8 | 37.7 | 84 (84.7) | 27.7 (29.7) |
| IMS20B-18M75C15C-4-****-AUL | 380 | 180 | 100 | 7.5 | 47.8 | 119.5 | 1500 | 4500 | 20.9 | 46.4 | 107.4 (108.1) | 34.7 (36.7) |

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
