// 修改本文件中的 title、text 即可更新网页解说；start 的单位是秒。
export const presentations = {
  "care": {
    "video": "presentations/care.mp4",
    "poster": "presentations/care.webp",
    "slides": [
      {
        "start": 0.0,
        "title": {
          "zh": "安伴智护",
          "en": "Anban Care"
        },
        "text": {
          "zh": "以老人取物、陪行与临时休息为起点，将手、轮、身体设计为可协同重构的陪护平台。",
          "en": "A companion platform built around fetching objects, assisted walking and short rest breaks, with coordinated reconfiguration of the hand, wheels and body."
        },
        "seek": 1.25
      },
      {
        "start": 10.85,
        "title": {
          "zh": "展示路线",
          "en": "Presentation overview"
        },
        "text": {
          "zh": "从养老场景的需求出发，依次介绍整体布局、核心机构、仿真优化与应用方向。",
          "en": "The presentation moves from care needs to the overall layout, core mechanisms, simulation studies and potential applications."
        }
      },
      {
        "start": 19.85,
        "title": {
          "zh": "养老陪护需求",
          "en": "Care needs"
        },
        "text": {
          "zh": "本页以养老场景与市场资料说明设计背景，关注家庭、社区和机构中的日常辅助任务。图中数据为原演示材料引用。",
          "en": "The slide introduces care settings and market context, focusing on everyday assistance at home, in communities and in care facilities. Charts reproduce the original presentation sources."
        }
      },
      {
        "start": 29.35,
        "title": {
          "zh": "从单一功能到连续服务",
          "en": "Connecting care tasks"
        },
        "text": {
          "zh": "将“拿不到”“走不稳”和陪护衔接不足转化为设计问题，目标是在同一平台组织取物、移动和休息支持。",
          "en": "Limited reach, unsteady walking and gaps in assistance become design requirements for a single platform supporting fetching, movement and rest."
        }
      },
      {
        "start": 37.25,
        "title": {
          "zh": "五类使用场景",
          "en": "Five use scenarios"
        },
        "text": {
          "zh": "通过取物助行、灵巧抓取、变形越障、人椅转换和辅助休息，说明整机各机构承担的任务。",
          "en": "Fetching, grasping, obstacle traversal, body-to-seat conversion and resting assistance explain the roles of the integrated mechanisms."
        }
      },
      {
        "start": 70.75,
        "title": {
          "zh": "整机结构布局",
          "en": "System layout"
        },
        "text": {
          "zh": "可重构手部与轮履模块负责操作和移动；折叠支撑、胸胯锁止与储物箱共同参与座椅转换。",
          "en": "Reconfigurable hands and wheel–track modules handle manipulation and movement. Folding supports, torso locks and the storage compartment participate in seat conversion."
        }
      },
      {
        "start": 79.85,
        "title": {
          "zh": "三构态机械手",
          "en": "Three-configuration hand"
        },
        "text": {
          "zh": "齿轮齿条调整副指朝向；滑块的同步与差动运动分别形成手指弯曲和摆动，球副补偿空间转角。",
          "en": "Rack-and-pinion motion reorients the auxiliary fingers. Synchronized and differential slider motion produce bending and lateral movement, with spherical joints accommodating spatial rotation."
        }
      },
      {
        "start": 93.45,
        "title": {
          "zh": "不同物品的抓取方式",
          "en": "Grasping different objects"
        },
        "text": {
          "zh": "用薄片、扁平、圆柱和异形物品说明不同构态的使用方向，展示边缘夹持、托举和包覆抓取的设计意图。",
          "en": "Thin, flat, cylindrical and irregular objects illustrate intended edge gripping, support and enveloping grasps across the hand configurations."
        }
      },
      {
        "start": 102.25,
        "title": {
          "zh": "轮式与履式的传动切换",
          "en": "Wheel–track transmission"
        },
        "text": {
          "zh": "电机、齿轮齿条与离合器配合改变传动路径，使圆轮移动与三角履带构态能够在同一轮部实现。",
          "en": "A motor, rack-and-pinion drive and clutch change the transmission path so one wheel assembly can support circular-wheel and triangular-track configurations."
        }
      },
      {
        "start": 117.65,
        "title": {
          "zh": "越障模式切换流程",
          "en": "Traversal mode sequence"
        },
        "text": {
          "zh": "演示按地形识别、低速停稳、同步变形和稳定通过组织动作，体现平路移动与障碍通行的不同需求。",
          "en": "The sequence covers terrain recognition, a low-speed stop, synchronized transformation and traversal, addressing different demands on level ground and obstacles."
        }
      },
      {
        "start": 126.25,
        "title": {
          "zh": "人形到临时座椅",
          "en": "Body-to-seat conversion"
        },
        "text": {
          "zh": "六杆机构后移储物箱，折叠后支撑与平行四杆协同下放；胸胯压紧机构通过自锁与挡块约束座椅构态。",
          "en": "A six-bar linkage moves the storage compartment rearward while folding supports and a parallelogram linkage lower the body. Self-locking geometry and stops constrain the seated configuration."
        }
      },
      {
        "start": 147.65,
        "title": {
          "zh": "陪行与休息衔接",
          "en": "From walking to resting"
        },
        "text": {
          "zh": "用户外陪行情境串联休息需求、后轮下放、储物箱后移和胸部锁止，说明临时座椅的使用流程。",
          "en": "An outdoor scenario connects a rest request to rear-support deployment, storage-compartment movement and torso locking, explaining the intended temporary-seat workflow."
        }
      },
      {
        "start": 156.45,
        "title": {
          "zh": "感知与机构协同",
          "en": "Perception and coordination"
        },
        "text": {
          "zh": "数字孪生方案将视觉、姿态与机构状态映射到模型，通过任务判断、模态互锁和异常反馈组织手、轮、身协同。",
          "en": "The digital-twin concept maps vision, posture and mechanism states into a model, coordinating the hand, wheels and body through task selection, interlocks and fault feedback."
        }
      },
      {
        "start": 165.65,
        "title": {
          "zh": "胯部机架轻量化",
          "en": "Hip-frame lightweighting"
        },
        "text": {
          "zh": "在 Fusion 中对胯部机架进行衍生优化，保留承载路径并去除冗余材料。页面给出的模型质量为原方案的 44.1%。",
          "en": "Generative optimization in Fusion preserves load paths while removing redundant material from the hip frame. The slide reports a model mass of 44.1% of the original design."
        }
      },
      {
        "start": 174.85,
        "title": {
          "zh": "关键零件载荷分析",
          "en": "Load analysis of key parts"
        },
        "text": {
          "zh": "使用 Ansys Workbench 检查胯部机架与腰部连接架等零件的载荷响应。结论对应所设材料、载荷和边界条件下的仿真。",
          "en": "Ansys Workbench evaluates load response in parts including the hip frame and waist connector. Findings apply to the materials, loads and boundary conditions of the simulation."
        }
      },
      {
        "start": 183.65,
        "title": {
          "zh": "机械手尺寸优化",
          "en": "Hand dimension optimization"
        },
        "text": {
          "zh": "在 MATLAB 中建立参数化运动学模型，以杆长和安装参数为变量，结合遗传算法考察工作空间、覆盖与运动平顺性。",
          "en": "A parameterized MATLAB kinematic model uses link lengths and mounting parameters as variables. A genetic algorithm explores workspace, coverage and motion smoothness."
        }
      },
      {
        "start": 193.05,
        "title": {
          "zh": "整机过障仿真",
          "en": "Whole-body traversal simulation"
        },
        "text": {
          "zh": "在 Adams/View 虚拟样机中观察质心高度与姿态响应，结合轮地接触和支撑区域检查过障稳定性。",
          "en": "An Adams/View virtual prototype tracks center-of-mass height and body response, using wheel contact and the support region to assess simulated traversal stability."
        }
      },
      {
        "start": 204.65,
        "title": {
          "zh": "三项机构创新",
          "en": "Three mechanism contributions"
        },
        "text": {
          "zh": "汇总三构态灵巧手、人形与座椅转换、离合器耦合轮履变形，将抓取、支撑和移动整合为可重构方案。",
          "en": "The summary brings together the three-configuration hand, body-to-seat conversion and clutch-coupled wheel–track transformation as one reconfigurable concept."
        }
      },
      {
        "start": 224.25,
        "title": {
          "zh": "应用方向",
          "en": "Potential applications"
        },
        "text": {
          "zh": "面向家庭、社区与养老机构，提出陪伴、取物递送和临时休息等应用方向；这些属于方案预期场景。",
          "en": "Potential settings include homes, communities and care facilities, with companionship, object delivery and temporary resting support as proposed uses."
        }
      },
      {
        "start": 232.85,
        "title": {
          "zh": "结束与展望",
          "en": "Closing and outlook"
        },
        "text": {
          "zh": "以陪护与休息的一体化服务结束展示。现有材料重点是数字化机构设计和仿真，实际服务效果仍需样机与场景验证。",
          "en": "The presentation closes on integrated companionship and resting support. Current evidence centers on digital mechanism design and simulation; service outcomes still require prototype and scenario validation."
        }
      }
    ]
  },
  "grooming": {
    "video": "presentations/grooming.mp4",
    "poster": "presentations/grooming.webp",
    "slides": [
      {
        "start": 0.0,
        "title": {
          "zh": "锋度绅士",
          "en": "Gentleman Grooming"
        },
        "text": {
          "zh": "围绕男士日常剃须与护理，将面部扫描、多轴运动、柔顺裹面和清洗维护整合为一套机器人方案。",
          "en": "A facial-care robot concept integrating face scanning, multi-axis motion, compliant wrapping and cleaning around everyday shaving and care."
        },
        "seek": 1.25
      },
      {
        "start": 10.65,
        "title": {
          "zh": "展示路线",
          "en": "Presentation overview"
        },
        "text": {
          "zh": "从分散的护理步骤出发，介绍整机布局、核心护理机构、优化设计与应用设想。",
          "en": "The presentation starts with fragmented care routines, then introduces the layout, treatment mechanisms, design studies and proposed applications."
        }
      },
      {
        "start": 19.65,
        "title": {
          "zh": "护理需求背景",
          "en": "Facial-care context"
        },
        "text": {
          "zh": "本页通过原材料中的市场图表引出多步骤护理需求，说明将护理工具与流程整合的设计背景。",
          "en": "Market charts from the original material introduce demand for multi-step care and the motivation for integrating tools and workflows."
        }
      },
      {
        "start": 30.25,
        "title": {
          "zh": "把分散步骤组成流程",
          "en": "Connecting the routine"
        },
        "text": {
          "zh": "热敷、涂泡、剃须、舒缓与清洗需要反复切换工具。方案以多步协同和模块化维护降低操作与管理负担。",
          "en": "Warm compresses, foaming, shaving, soothing and cleaning involve repeated tool changes. The concept uses coordinated steps and modular maintenance to reduce handling effort."
        }
      },
      {
        "start": 37.65,
        "title": {
          "zh": "准备、护理与清洁",
          "en": "Preparation, care and cleaning"
        },
        "text": {
          "zh": "工作流程按准备、护理、清洁展开，将扫描、纸巾加热、剃须与刀头清洗放入连续任务中。",
          "en": "The workflow connects scanning, tissue warming, shaving and blade cleaning through preparation, care and cleanup stages."
        }
      },
      {
        "start": 75.55,
        "title": {
          "zh": "功能模块布局",
          "en": "Functional layout"
        },
        "text": {
          "zh": "剃须、扫描、裹面和夹取机构围绕工作区布置，储料及蓄排液模块集中管理耗材与废液。",
          "en": "Shaving, scanning, wrapping and gripping modules surround the work area, while storage and fluid-handling modules organize supplies and waste."
        }
      },
      {
        "start": 104.95,
        "title": {
          "zh": "感知到执行的护理闭环",
          "en": "From sensing to execution"
        },
        "text": {
          "zh": "方案通过 D435 面部扫描、手眼标定和轨迹规划，将面部轮廓转化为四轴模块的运动任务，并接收状态反馈。",
          "en": "The concept links D435 face scanning, hand–eye calibration and path planning to four-axis motion tasks, with operating-state feedback."
        }
      },
      {
        "start": 114.65,
        "title": {
          "zh": "热敷与自适应裹面",
          "en": "Warm compress and adaptive wrapping"
        },
        "text": {
          "zh": "夹爪搬运加热纸巾，圆弧机构接近面部，再由三级欠驱指节逐步包覆。页面中的 0.781 N 接触力来自 Adams 仿真。",
          "en": "A gripper transfers warmed tissue, an arc mechanism approaches the face and three underactuated stages progressively conform. The reported 0.781 N contact force is an Adams simulation result."
        }
      },
      {
        "start": 126.05,
        "title": {
          "zh": "四轴动态剃须",
          "en": "Four-axis shaving motion"
        },
        "text": {
          "zh": "纵向移动、圆弧滑移、轴向伸缩与横向转动共同覆盖面部，末端刀具与夹爪在有限空间内执行不同护理动作。",
          "en": "Longitudinal travel, arc motion, axial extension and transverse rotation provide facial coverage for tools and grippers within a compact workspace."
        }
      },
      {
        "start": 137.05,
        "title": {
          "zh": "刀具自清洁",
          "en": "Tool self-cleaning"
        },
        "text": {
          "zh": "可拆卸刀网与清洗平台配合，按脱扣、固定、振动清洁和复位的顺序组织维护动作。",
          "en": "A detachable blade screen works with a cleaning platform through release, retention, vibration cleaning and reinstallation."
        }
      },
      {
        "start": 149.25,
        "title": {
          "zh": "护理状态可视化",
          "en": "Visible care status"
        },
        "text": {
          "zh": "交互界面用于选择护理步骤并呈现水温、耗材和运行状态，让用户能够确认任务、查看进度和处理提醒。",
          "en": "The interface supports care-step selection and displays temperature, supplies and operating state so users can confirm tasks, follow progress and respond to alerts."
        }
      },
      {
        "start": 183.45,
        "title": {
          "zh": "结构仿真分析",
          "en": "Structural simulation"
        },
        "text": {
          "zh": "对储料底座、圆弧导轨基座与减速轮系开展载荷和安全系数分析，检查设计工况下的结构响应。",
          "en": "Load and safety-factor studies examine the storage base, curved-guide support and reduction gears under the specified design conditions."
        }
      },
      {
        "start": 192.45,
        "title": {
          "zh": "接触与运动安全",
          "en": "Contact and motion safeguards"
        },
        "text": {
          "zh": "设计将刀网隔离、柔性末端、机械限位与限速回撤结合，并提出人脸丢失、越界和超温时的暂停报警策略。",
          "en": "The design combines a blade screen, compliant ends, mechanical limits and limited-speed retraction, with proposed responses to face loss, boundary violations and overheating."
        }
      },
      {
        "start": 201.85,
        "title": {
          "zh": "可维护的模块划分",
          "en": "Modules for maintenance"
        },
        "text": {
          "zh": "供水、蓄水、排水、抽纸和清洗分别布置，便于补充耗材与维护，并让温度和废液管理更清晰。",
          "en": "Water supply, storage, drainage, tissue dispensing and cleaning are separated to support replenishment, maintenance and clear temperature and wastewater handling."
        }
      },
      {
        "start": 210.45,
        "title": {
          "zh": "视觉支撑护理任务",
          "en": "Vision for care tasks"
        },
        "text": {
          "zh": "以 D435 相机为感知入口，将面部信息与护理区域和轨迹规划衔接，服务个性化动作生成的方案目标。",
          "en": "The D435 camera provides facial information for care regions and path planning as part of the proposed personalized-motion pipeline."
        }
      },
      {
        "start": 223.65,
        "title": {
          "zh": "柔顺与清洁机构",
          "en": "Compliance and cleaning"
        },
        "text": {
          "zh": "总结欠驱裹面的适应能力与刀网拆洗机构，把贴合动作和后续维护作为同一护理流程的组成部分。",
          "en": "Underactuated wrapping and the detachable cleaning mechanism connect conforming contact with maintenance as parts of one care routine."
        }
      },
      {
        "start": 246.85,
        "title": {
          "zh": "工作区与耗材集成",
          "en": "Work area and supply integration"
        },
        "text": {
          "zh": "通过打泡、储棉、抽纸、加热、进液和废料区的分工，说明多种护理操作如何围绕共同平台组织。",
          "en": "Foaming, cotton storage, tissue dispensing, heating, fluid intake and waste zones organize multiple care operations around a shared platform."
        }
      },
      {
        "start": 259.05,
        "title": {
          "zh": "应用方向",
          "en": "Potential applications"
        },
        "text": {
          "zh": "提出美容机构与商业自助护理场景，探索标准流程与套餐选择的可能性；应用效果属于后续验证目标。",
          "en": "Proposed uses include care businesses and self-service settings, exploring standardized routines and selectable packages. Their benefits remain targets for future validation."
        }
      },
      {
        "start": 268.05,
        "title": {
          "zh": "结束与展望",
          "en": "Closing and outlook"
        },
        "text": {
          "zh": "展示以面部护理的一体化结束。当前工作主要支持机构、控制流程与仿真可行性，不能替代真实用户的安全和护理效果验证。",
          "en": "The presentation closes on integrated facial care. Current work addresses mechanisms, control workflows and simulation feasibility, rather than validated user safety or treatment outcomes."
        }
      }
    ]
  },
  "printer": {
    "video": "presentations/printer.mp4",
    "poster": "presentations/printer.webp",
    "slides": [
      {
        "start": 0.0,
        "title": {
          "zh": "食界巧味打印机",
          "en": "Food 3D Printer"
        },
        "text": {
          "zh": "面向家用食品打印，将多材料送料、换料定位、三轴运动和折叠收纳整合到同一设备中。",
          "en": "A home food-printing concept combining multi-material feeding, indexed material changes, three-axis motion and folding storage."
        },
        "seek": 2.25
      },
      {
        "start": 11.4,
        "title": {
          "zh": "目录展开",
          "en": "Opening the contents"
        },
        "text": {
          "zh": "进入目录，接下来逐项介绍项目背景、作品简介、方案与优化设计。",
          "en": "The contents introduce the project background, overview, design and optimization."
        }
      },
      {
        "start": 19.95,
        "title": {
          "zh": "目录：项目背景",
          "en": "Contents: project background"
        },
        "text": {
          "zh": "目录首先展开项目背景，说明家用食品打印的需求与问题。",
          "en": "The first contents item introduces the needs and problems behind home food printing."
        }
      },
      {
        "start": 28.55,
        "title": {
          "zh": "目录：作品简介",
          "en": "Contents: project overview"
        },
        "text": {
          "zh": "加入作品简介，建立对整机布局与工作流程的整体认识。",
          "en": "The overview introduces the machine layout and workflow."
        }
      },
      {
        "start": 37.15,
        "title": {
          "zh": "目录：方案设计",
          "en": "Contents: mechanism design"
        },
        "text": {
          "zh": "目录展开方案设计，后续说明送料、定位、换料和收纳机构。",
          "en": "The design section covers feeding, positioning, material switching and storage mechanisms."
        }
      },
      {
        "start": 45.75,
        "title": {
          "zh": "目录：优化设计",
          "en": "Contents: optimization"
        },
        "text": {
          "zh": "加入优化设计部分，关注结构受力和模块化维护。",
          "en": "The optimization section examines structural loads and modular maintenance."
        }
      },
      {
        "start": 54.35,
        "title": {
          "zh": "目录：创新点",
          "en": "Contents: design innovations"
        },
        "text": {
          "zh": "目录加入创新点，汇总送料、换料与折叠结构的关联。",
          "en": "The innovations section connects feeding, switching and folding mechanisms."
        }
      },
      {
        "start": 62.95,
        "title": {
          "zh": "目录总览",
          "en": "Complete contents"
        },
        "text": {
          "zh": "完整目录以应用前景结束，随后进入项目背景与具体设计。",
          "en": "Applications complete the contents, before the presentation moves into the background and detailed design."
        }
      },
      {
        "start": 72.7,
        "title": {
          "zh": "食品打印的设计起点",
          "en": "Why food printing"
        },
        "text": {
          "zh": "围绕个性化造型、材料控制和营养配比，说明食品 3D 打印的设计动机。",
          "en": "Personalized shapes, material control and ingredient proportions form the motivation for food 3D printing."
        }
      },
      {
        "start": 84.65,
        "title": {
          "zh": "现有技术与家用约束",
          "en": "Technology and home-use constraints"
        },
        "text": {
          "zh": "比较挤出、粉体凝结与喷墨等方式，提出家用方案应同时关注操作简便、多材料适配和空间占用。",
          "en": "Extrusion, powder binding and inkjet approaches frame the need for convenient operation, material flexibility and compact home use."
        }
      },
      {
        "start": 90.95,
        "title": {
          "zh": "整机机构布局",
          "en": "Mechanism layout"
        },
        "text": {
          "zh": "三轴机构负责空间定位，螺旋压力机构负责送料，棘轮机构完成换料锁止，伸缩与四连杆机构用于折叠。",
          "en": "Three-axis motion handles positioning, a screw-driven press feeds material, a ratchet indexes material changes and an extending linkage folds the frame."
        }
      },
      {
        "start": 100.25,
        "title": {
          "zh": "从装料到收纳",
          "en": "From loading to storage"
        },
        "text": {
          "zh": "按装料、设置参数、送料打印、复位和旋转收纳组织流程，说明料筒与打印平台如何配合。",
          "en": "Loading, parameter setup, extrusion, resetting and folding describe how the cartridge and printing platform work together."
        }
      },
      {
        "start": 126.75,
        "title": {
          "zh": "数字化辅助控制",
          "en": "Digital control concept"
        },
        "text": {
          "zh": "将模型选择、打印参数与温控结合。页面以 PID 仿真研究温度超调与稳定性，相关精度属于模型结果。",
          "en": "Model selection and print parameters are linked to temperature control. PID simulation examines overshoot and stability; the stated precision describes model results."
        }
      },
      {
        "start": 136.45,
        "title": {
          "zh": "三轴打印定位",
          "en": "Three-axis positioning"
        },
        "text": {
          "zh": "喷头沿 Y、Z 轴移动，平台沿 X 轴配合定位；启动校准与任务结束后的复位形成完整定位流程。",
          "en": "The nozzle moves along Y and Z while the platform travels along X, with startup calibration and end-of-job resetting completing the positioning sequence."
        }
      },
      {
        "start": 144.6,
        "title": {
          "zh": "螺旋压力送料",
          "en": "Screw-driven pressure feeding"
        },
        "text": {
          "zh": "齿轮传动将旋转转化为推杆直线运动，推动料筒中的食材；计数中断方案用于行程结束后的返回。",
          "en": "Gears convert rotation into linear pusher travel to press food from the cartridge. A counter-interrupt scheme is proposed for returning after the dispensing stroke."
        }
      },
      {
        "start": 156.6,
        "title": {
          "zh": "换料定位与锁止",
          "en": "Material indexing and locking"
        },
        "text": {
          "zh": "用 PID 仿真研究联动轴角度响应，再由棘轮机构完成 90° 锁止，将驱动调节与机械定位结合。",
          "en": "PID simulation studies the indexing-shaft response, while a ratchet provides a 90° mechanical lock, combining controlled motion with positive positioning."
        }
      },
      {
        "start": 171.95,
        "title": {
          "zh": "工作与收纳模式",
          "en": "Working and storage modes"
        },
        "text": {
          "zh": "螺旋推杆与滑块式四连杆配合使龙门架旋转折叠；取下料筒后再执行模式切换，减少闲置占用。",
          "en": "A screw actuator and slider four-bar linkage rotate the gantry into storage. Mode changes follow cartridge removal to reduce unused footprint."
        }
      },
      {
        "start": 180.55,
        "title": {
          "zh": "人机交互：界面概览",
          "en": "Interface: overview"
        },
        "text": {
          "zh": "展示“巧食坊”概念界面，以直观的导航连接设备、模型和打印状态，降低设置流程的理解成本。",
          "en": "The concept interface connects devices, models and print status through clear navigation, making the setup sequence easier to understand."
        }
      },
      {
        "start": 194.15,
        "title": {
          "zh": "人机交互：网页入口",
          "en": "Interface: web entry"
        },
        "text": {
          "zh": "以浏览器中的“巧食坊”启动画面说明网页交互入口，后续页面将设备、模型和状态信息串联起来。",
          "en": "The browser-based launch screen introduces the web entry to ChocoCraft, with subsequent pages connecting devices, models and status."
        }
      },
      {
        "start": 208.15,
        "title": {
          "zh": "人机交互：模型管理",
          "en": "Interface: model management"
        },
        "text": {
          "zh": "“我的模型”展示模型列表与新建入口，将不同食品造型集中管理，为选择打印任务提供入口。",
          "en": "The model page presents saved designs and an add-model entry, organizing food shapes for selecting print tasks."
        }
      },
      {
        "start": 222.15,
        "title": {
          "zh": "人机交互：设备连接",
          "en": "Interface: device connection"
        },
        "text": {
          "zh": "设备页展示最近连接、蓝牙和 NFC 连接等概念入口。这里说明交互流程，不代表各连接方式均已完成硬件联调。",
          "en": "The device page shows recent devices and conceptual Bluetooth and NFC connection options. These illustrate the workflow rather than verified hardware integrations."
        }
      },
      {
        "start": 236.15,
        "title": {
          "zh": "人机交互：个人中心",
          "en": "Interface: personal area"
        },
        "text": {
          "zh": "个人中心汇集打印记录、模型分享、常见问题与改进建议，并提供已保存模型的管理入口。",
          "en": "The personal area groups print history, model sharing, help and feedback, with access to saved-model management."
        }
      },
      {
        "start": 250.15,
        "title": {
          "zh": "人机交互：打印状态",
          "en": "Interface: print status"
        },
        "text": {
          "zh": "首页展示连接设备、当前任务、进度、剩余时间与耗材信息。页面数字属于概念界面演示，不作为真实运行数据。",
          "en": "The home screen presents the device, current task, progress, remaining time and supplies. Displayed numbers are interface-demo content, not measured operating data."
        }
      },
      {
        "start": 265.35,
        "title": {
          "zh": "承载件应力分析",
          "en": "Stress analysis of load-bearing parts"
        },
        "text": {
          "zh": "对折叠承载结构和料筒开展应力分析，结合材料与边界条件检查局部受力。仿真结论不等同于长期耐久试验。",
          "en": "Stress studies examine the folding support and cartridge under specified materials and boundary conditions. These findings do not replace long-term durability tests."
        }
      },
      {
        "start": 275.55,
        "title": {
          "zh": "料筒拆卸与清洁",
          "en": "Cartridge disassembly and cleaning"
        },
        "text": {
          "zh": "接触式连接与螺纹连接让料筒构件能够拆出清洗，并支持更换喷头孔径；选材按部件接触与温度需求区分。",
          "en": "Contact-fit and threaded connections allow cartridge parts to be removed for cleaning and nozzle sizes to be changed. Materials are selected by contact and temperature requirements."
        }
      },
      {
        "start": 288.55,
        "title": {
          "zh": "三项机构创新",
          "en": "Three mechanism contributions"
        },
        "text": {
          "zh": "螺旋压力送料、棘轮换料与旋转收纳分别对应材料输送、多材料定位和家庭空间利用。",
          "en": "Pressure feeding, ratchet indexing and rotating storage address material delivery, multi-material positioning and use of household space."
        }
      },
      {
        "start": 301.75,
        "title": {
          "zh": "应用设想",
          "en": "Proposed applications"
        },
        "text": {
          "zh": "展示个性化餐饮与特殊饮食的潜在方向。食品成分控制和实际营养适用性还需要独立验证。",
          "en": "The slide outlines personalized food and special-diet applications. Ingredient control and nutritional suitability require separate validation."
        }
      },
      {
        "start": 310.75,
        "title": {
          "zh": "结束与展望",
          "en": "Closing and outlook"
        },
        "text": {
          "zh": "以多材料、可收纳的家用食品打印方案结束展示，后续需通过样机确认挤出稳定性、换料可靠性和清洁效果。",
          "en": "The presentation closes on a foldable multi-material food printer, with prototypes needed to confirm extrusion stability, indexing reliability and cleaning performance."
        }
      }
    ]
  },
  "frog": {
    "video": "presentations/frog.mp4",
    "poster": "presentations/frog.webp",
    "slides": [
      {
        "start": 0.0,
        "title": {
          "zh": "蛙鲜速剥",
          "en": "Bullfrog Processing System"
        },
        "text": {
          "zh": "面向牛蛙加工流程，提出集进料、定位、开膛去脏、剥皮与收集于一体的多模块装置。",
          "en": "A multi-module processing concept integrates feeding, positioning, opening and evisceration, skin removal and collection."
        },
        "seek": 1.25
      },
      {
        "start": 10.65,
        "title": {
          "zh": "展示路线",
          "en": "Presentation overview"
        },
        "text": {
          "zh": "从加工需求出发，依次介绍作业流程、机构布局、关键动作与优化方向。",
          "en": "The presentation moves from processing needs to the workflow, mechanism layout, key motions and design studies."
        }
      },
      {
        "start": 19.85,
        "title": {
          "zh": "加工需求背景",
          "en": "Processing context"
        },
        "text": {
          "zh": "原演示以消费与产业图表说明自动化加工需求，重点在于如何衔接多个处理工序。",
          "en": "The original market and industry charts introduce automation needs, with a focus on connecting multiple processing stages."
        }
      },
      {
        "start": 29.15,
        "title": {
          "zh": "多工序协同问题",
          "en": "Coordinating processing stages"
        },
        "text": {
          "zh": "将活体定位、切割定位和工序衔接列为设计问题，尝试用一体化机构流程减少各步骤间的人工转移。",
          "en": "Positioning, cutting alignment and stage coordination are treated as design problems, with an integrated workflow intended to reduce transfers between operations."
        }
      },
      {
        "start": 37.25,
        "title": {
          "zh": "五步作业流程",
          "en": "Five-stage workflow"
        },
        "text": {
          "zh": "按送蛙推蛙、摆正夹头、开膛去脏、切头去皮和推蛙收集展开，说明各模块的先后关系。",
          "en": "Feeding, alignment and head restraint, opening and evisceration, head and skin removal, and collection define the sequence of modules."
        }
      },
      {
        "start": 70.75,
        "title": {
          "zh": "整机结构布局",
          "en": "System layout"
        },
        "text": {
          "zh": "储蛙装置、进料通道与推送机构连接前端，摆正、夹头、开膛和夹皮机构沿加工流程布置。",
          "en": "Storage, an inlet channel and a pusher form the feeding side; alignment, head restraint, opening and skin-gripping mechanisms follow the processing sequence."
        }
      },
      {
        "start": 80.45,
        "title": {
          "zh": "进入与推送",
          "en": "Feeding and pushing"
        },
        "text": {
          "zh": "本页演示前端进料和推送动作，关注来料如何进入后续定位工位。",
          "en": "This slide demonstrates entry and pushing, showing how the feed is transferred toward the positioning station."
        }
      },
      {
        "start": 91.25,
        "title": {
          "zh": "摆正与夹头",
          "en": "Alignment and head restraint"
        },
        "text": {
          "zh": "通过摆正与夹持为后续刀具动作建立位置基准，减少工序之间的姿态变化。",
          "en": "Alignment and restraint establish a position reference for tool movement and aim to limit posture changes between stages."
        }
      },
      {
        "start": 105.65,
        "title": {
          "zh": "开膛、去脏与剥皮",
          "en": "Opening, evisceration and skin removal"
        },
        "text": {
          "zh": "同步带传动驱动刀具旋转；方案先开膛，再换用去脏刀具，最后由夹皮装置完成剥皮动作。",
          "en": "A synchronous-belt drive rotates the cutting tool. The proposed sequence opens the abdomen, changes to an evisceration tool and then uses a skin gripper for removal."
        }
      },
      {
        "start": 114.45,
        "title": {
          "zh": "可变形加工平台",
          "en": "Transforming work platform"
        },
        "text": {
          "zh": "丝杆带动底板移动，驱动块压缩弹簧并通过撑杆抬起顶板；卸力后利用弹簧复位，形成平台转换。",
          "en": "A screw moves the base plate; a drive block compresses a spring and raises the top plate through a strut. Releasing the load lets the spring reset the platform."
        }
      },
      {
        "start": 123.25,
        "title": {
          "zh": "数字孪生与协同控制",
          "en": "Digital twin and coordinated control"
        },
        "text": {
          "zh": "方案将图像、位姿、电流和到位信号映射到模型，以节拍判断、模态互锁与异常回撤协调输送、夹头、刀具和平台。",
          "en": "The concept maps image, pose, current and position signals into a model, coordinating feeding, restraint, tools and the platform through timing decisions, interlocks and fault retraction."
        }
      },
      {
        "start": 132.65,
        "title": {
          "zh": "关键机构仿真",
          "en": "Simulation of key mechanisms"
        },
        "text": {
          "zh": "检查夹皮装置与摆正机构的变形和应力。页面给出的约 46.58 MPa 属于排除应力奇异点后的仿真分析结果。",
          "en": "Deformation and stress are examined for the skin gripper and alignment mechanism. The reported approximately 46.58 MPa comes from simulation after excluding stress singularities."
        }
      },
      {
        "start": 141.45,
        "title": {
          "zh": "卫生、环保与经济适配",
          "en": "Hygiene, environment and cost"
        },
        "text": {
          "zh": "提出易清洁接触部件、模块化拆装及内脏和皮屑分类收集，并将连续加工与成本优化作为应用目标。",
          "en": "The design proposes cleanable contact parts, modular disassembly and separated waste collection, with continuous processing and cost reduction as application goals."
        }
      },
      {
        "start": 150.65,
        "title": {
          "zh": "多模块协同总结",
          "en": "Coordinated modules"
        },
        "text": {
          "zh": "汇总模块化一体流程、摆正与柔性夹头、多工位往复加工三项设计。页面中的加工速度属于原方案陈述，尚不能视为实测产能。",
          "en": "The summary covers integrated modules, alignment with compliant head restraint, and reciprocating multi-station processing. The slide’s speed claim is part of the original concept, not established measured throughput."
        }
      },
      {
        "start": 165.05,
        "title": {
          "zh": "应用方向",
          "en": "Potential applications"
        },
        "text": {
          "zh": "提出餐饮后厨、预制食材和生鲜供应等应用场景，目标是减少重复处理并衔接标准化加工。",
          "en": "Proposed settings include restaurant kitchens, prepared ingredients and fresh-food supply, aiming to reduce repetitive handling and support standardized processing."
        }
      },
      {
        "start": 173.45,
        "title": {
          "zh": "结束与展望",
          "en": "Closing and outlook"
        },
        "text": {
          "zh": "展示以一体化加工流程结束。现有材料主要是机构设计与仿真，处理质量、效率和卫生维护效果仍需样机验证。",
          "en": "The presentation closes on an integrated workflow. Current material covers mechanism design and simulation; quality, throughput and hygiene maintenance still need prototype validation."
        }
      }
    ]
  }
};
