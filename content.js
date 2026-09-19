// 中英文内容集中维护；图片、视频与证书使用 assets/ 中的网页副本。
export const bilingual = (zh, en) => ({ zh, en });
const b = bilingual;
export const profile = {
  name: b('陈影凌', 'Yingling Chen'),
  email: 'chenyingling5245@gmail.com',
  phone: '15871847840',
  github: 'https://github.com/Afazeni',
};

export const projects = [
  {
    id: 'care', number: '01', year: '2026', image: 'care.webp', galleryIntervalMs: 1000,
    background: {"zh": "面向居家养老环境中取物、陪行、辅助休息及复杂地面通行等连续需求，单一功能的家庭服务机器人往往难以同时兼顾操作能力、移动能力与承载功能。结合人形机器人机械结构创新的赛题方向，本项目提出一款多形态可重构老人陪护机器人：在人形状态下完成陪伴、抓取与辅助行动，在不同路面下通过轮履重构提升通过能力，并进一步通过整机形态转换形成临时座椅，使同一机械平台能够覆盖更多居家陪护场景。", "en": "Home-based elderly care involves connected needs such as retrieving objects, accompanying users, supporting rest and traversing difficult surfaces. Single-purpose domestic service robots often struggle to combine manipulation, mobility and load-bearing functions. Following a competition brief on innovative humanoid robot mechanisms, this project proposes a multi-configuration, reconfigurable care robot. Its humanoid configuration supports companionship, grasping and assisted movement; wheel–track reconfiguration improves terrain mobility; and whole-body transformation creates a temporary seat, allowing one mechanical platform to address a wider range of home-care situations."},
    methods: [
  {
    "title": {
      "zh": "人椅重构与机械锁止",
      "en": "Human–chair reconfiguration and mechanical locking"
    },
    "text": {
      "zh": "为兼顾人形陪护姿态与临时座椅功能，采用六杆机构驱动腹部储物箱后移并形成座面支撑；后轮经折叠伸缩机构展开，胸部再由平行四杆机构下压完成形态转换。座椅到位后，胸部压紧机构与胯部机架嵌合，并利用连杆共线自锁、垂直自锁及行程挡块限制回退、偏转与过位，实现无持续驱动力条件下的稳定锁止。",
      "en": "To combine a humanoid care posture with a temporary seat, a six-bar linkage moves the abdominal storage compartment rearward to form the seat support. The rear wheels deploy through a folding telescopic mechanism, and a parallelogram linkage lowers the chest to complete the transformation. Once in position, the chest clamping mechanism engages the hip frame. Collinear linkage self-locking, perpendicular self-locking and travel stops constrain reversal, rotation and overtravel, maintaining the locked configuration without continuous actuation."
    }
  },
  {
    "title": {
      "zh": "轮履切换与地形适应",
      "en": "Wheel–track switching and terrain adaptation"
    },
    "text": {
      "zh": "针对平整路面效率与复杂路面通过能力难以兼顾的问题，设计轮—履可重构行走机构。通过电机驱动齿轮齿条控制离合状态，并联动副轮展开/收缩及链条啮合状态，实现轮式与履带式两种构型切换：轮式状态降低滚动阻力，履带状态增大接地面积与越障能力，从而适应不同路面工况。",
      "en": "A reconfigurable wheel–track mechanism balances efficient travel on smooth surfaces with mobility over difficult terrain. A motor-driven rack and pinion controls clutch engagement while coordinating auxiliary-wheel deployment or retraction and chain engagement. Wheel mode reduces rolling resistance; track mode increases ground contact area and obstacle-crossing capability to suit different surface conditions."
    }
  },
  {
    "title": {
      "zh": "多构态灵巧手",
      "en": "Multi-configuration dexterous hand"
    },
    "text": {
      "zh": "针对日常用品抓取、夹持及搀扶支撑等不同任务，采用构型可变的多指机构。通过齿条同步驱动两侧齿轮，调整副指朝向，实现包覆、对向夹持等抓取构型切换；单指内部采用滑块联动机构协调指节弯曲，并叠加横向摆动自由度，在有限驱动数量下扩大末端操作范围。",
      "en": "A reconfigurable multi-finger mechanism supports everyday grasping, clamping and assisted support. A rack drives gears on both sides synchronously to reorient the auxiliary fingers, switching between enveloping and opposing grasps. Within each finger, a slider linkage coordinates joint bending, while an additional lateral swing degree of freedom extends the manipulation range with a limited number of actuators."
    }
  },
  {
    "title": {
      "zh": "轻量化与虚拟样机验证",
      "en": "Lightweighting and virtual prototype validation"
    },
    "text": {
      "zh": "针对座椅形态下承载增加及整机质量控制问题，使用 Fusion 360 对胯部机架进行拓扑优化，去除低效承载区域材料，质量降至原来的 44.1%；随后利用 ANSYS Workbench 对胯部机架和腰部连接架进行强度与变形校核。整机层面基于 Adams/View 建立虚拟样机，通过连续过障过程中的质心轨迹与机身姿态变化评估动态稳定性。",
      "en": "To address increased loading in chair mode and overall mass control, Fusion 360 topology optimization removes material from inefficient load-bearing regions of the hip frame, leaving 44.1% of its original mass. ANSYS Workbench then checks strength and deformation of the hip frame and waist connection frame. At system level, an Adams/View virtual prototype evaluates dynamic stability through center-of-mass trajectories and body attitude changes during successive obstacle crossings."
    }
  }
],
    gallery: [{"src": "care-gallery-1.webp", "alt": {"zh": "老人陪护机器人", "en": "Elderly companion robot"}}, {"src": "care-gallery-2.webp", "alt": {"zh": "机器人-透明外壳", "en": "Robot with transparent shell"}}, {"src": "care-gallery-3.webp", "alt": {"zh": "机器人-椅子", "en": "Robot in chair configuration"}}, {"src": "care-gallery-4.webp", "alt": {"zh": "机器人-椅子-人", "en": "Chair configuration with a seated person"}}],
    title: b('安伴智护', 'Anban Care'),
    subtitle: b('多形态可重构陪护机器人', 'Reconfigurable companion robot'),
    category: b('灵巧抓取·形态重构·轮系越障', 'Dexterous grasping · Reconfiguration · Terrain traversal'),
    description: b('让一台机器人在陪伴、取物与座椅形态之间转换。围绕手、轮与身体，探索机构的协同重构。', 'A companion robot designed to grasp, move and transform into a seat. Exploring coordinated reconfiguration of the hand, wheels and body.'),
    date: b('2026.02 — 2026.08', 'Feb — Aug 2026'),
    tools: ['SolidWorks', 'Adams', 'Ansys', 'MATLAB', 'Fusion'],
    summary: {
  "highlights": [
    {
      "zh": "人椅重构：连杆机构协同变形，机械自锁保持座椅姿态。",
      "en": "Body-to-seat transformation: coordinated linkages and mechanical self-locking maintain the seat configuration."
    },
    {
      "zh": "轮履切换与多构态手：分别适应路面变化和不同抓取任务。",
      "en": "Wheel–track switching and a reconfigurable hand address changing terrain and grasping tasks."
    },
    {
      "zh": "轻量化：胯部机架拓扑优化后质量降至原来的 44.1%。",
      "en": "Lightweighting: topology optimization reduces hip-frame mass to 44.1% of the original."
    }
  ],
  "status": {
    "zh": "已形成整机数字样机、机构动画及仿真分析，完成关键结构强度校核与连续过障动态稳定性评估；本页展示的是数字设计与仿真成果。",
    "en": "The work includes a full digital prototype, mechanism animations and simulation studies, with strength checks for key structures and dynamic stability assessment during successive obstacle crossings. This page presents digital design and simulation results."
  }
},
    brief: {"zh": "面向老人的取物、陪行与临时休息需求，在同一机身内兼顾灵活抓取、不同路面通行和座椅承载，重点解决多种形态切换时的传动、支撑与锁止问题。", "en": "Support everyday reaching, assisted travel and temporary rest within one body. The challenge is to combine adaptable grasping, terrain mobility and seat load-bearing while coordinating transmission, support and locking during reconfiguration."},
    contribution: {"zh": "担任队长，负责整机机械方案与三维建模；完成可重构机械手、轮履切换、人椅变形及胸部压紧机构设计，并开展手指尺寸优化、运动仿真和关键零件有限元分析。", "en": "As team lead, I developed the overall mechanical concept and CAD model, designed the reconfigurable hand, wheel–track switch, body-to-seat transformation and chest clamp, and carried out finger sizing optimization, motion simulation and finite element analysis of key parts."},
    sections: [
  {
    "title": {
      "zh": "功能创新",
      "en": "Functional innovation"
    },
    "text": {
      "zh": "通过齿轮齿条实现3个构态的切换，13个自由度就可抓取大部分物体，显著提高了灵巧手的灵敏度和准确度",
      "en": "A rack-and-pinion drive switches between three configurations. With 13 degrees of freedom, the dexterous hand can grasp most objects, significantly improving its responsiveness and accuracy."
    },
    "media": {
      "type": "video",
      "src": "care-detail-1.mp4",
      "poster": "care-detail-1.webp"
    },
    "subtitle": {
      "zh": "齿轮齿条驱动，3种构态切换",
      "en": "Rack-and-pinion drive, three configurations"
    }
  },
  {
    "title": {
      "zh": "结构创新",
      "en": "Structural innovation"
    },
    "text": {
      "zh": "将人形机器人与多功能座椅结合，突破传统人形机器人陪护的局限性，实现人形与座椅的自由切换，满足老人多方面需求",
      "en": "Combining a humanoid robot with a multifunctional seat expands conventional companion-robot capabilities. Switching between humanoid and seated configurations addresses a wider range of elderly care needs."
    },
    "media": {
      "type": "video",
      "src": "care-detail-2.mp4",
      "poster": "care-detail-2.webp"
    },
    "subtitle": {
      "zh": "人形机器人+多功能座椅",
      "en": "Humanoid robot + multifunctional seat"
    }
  },
  {
    "title": {
      "zh": "机构创新",
      "en": "Mechanism innovation"
    },
    "text": {
      "zh": "基于离合器与双滑块机构的耦合，轮系交替接合-失效-分离，实现不同路况轮式/履式的自由切换",
      "en": "Coupling a clutch with a dual-slider mechanism alternately engages, deactivates and disengages the wheel system, enabling transitions between wheeled and tracked configurations for different terrain."
    },
    "media": {
      "type": "video",
      "src": "care-detail-3.mp4",
      "poster": "care-detail-3.webp"
    },
    "subtitle": {
      "zh": "离合器与双滑块机构耦合",
      "en": "Clutch coupled with a dual-slider mechanism"
    }
  },
  {
    "title": {
      "zh": "拓扑优化",
      "en": "Topology optimization"
    },
    "subtitle": {
      "zh": "轻量化设计与有限元验证",
      "en": "Lightweight design and finite element verification"
    },
    "text": {
      "zh": "在 Autodesk Fusion 中对机器人胯部机架进行拓扑优化，去除非承载区域的冗余材料。根据提供的设计结果，优化后质量降至原来的44.1%；再通过 Ansys Workbench 对机架及关键连接件进行载荷分析，验证其在设定工况下的承载表现。",
      "en": "Topology optimization in Autodesk Fusion removes redundant material from non-load-bearing regions of the robot’s hip frame. The supplied design results report a final mass of 44.1% of the original. Load analysis in Ansys Workbench then evaluates the frame and key connectors under the specified operating conditions."
    },
    "media": {
      "type": "carousel",
      "id": "care-topology",
      "intervalMs": 1000,
      "items": [
        {
          "type": "image",
          "src": "care-topology-1.webp",
          "alt": {
            "zh": "初始模型",
            "en": "Initial model"
          }
        },
        {
          "type": "image",
          "src": "care-topology-2.webp",
          "alt": {
            "zh": "第一次优化",
            "en": "First optimization"
          }
        },
        {
          "type": "image",
          "src": "care-topology-3.webp",
          "alt": {
            "zh": "应力仿真1",
            "en": "Stress simulation 1"
          }
        },
        {
          "type": "image",
          "src": "care-topology-4.webp",
          "alt": {
            "zh": "应力仿真2",
            "en": "Stress simulation 2"
          }
        }
      ]
    }
  },
  {
    "title": {
      "zh": "过障分析",
      "en": "Obstacle-crossing analysis"
    },
    "subtitle": {
      "zh": "整机虚拟样机与姿态稳定性",
      "en": "Full-system virtual prototype and attitude stability"
    },
    "text": {
      "zh": "在 Adams/View 中建立整机虚拟样机，分析坡道与连续障碍通过过程中的质心高度和机身姿态。所示仿真工况下，初始冲击后质心响应逐渐收敛，后续波动较小，机身姿态恢复平稳。",
      "en": "A full-system virtual prototype in Adams/View tracks center-of-mass height and body attitude while traversing slopes and successive obstacles. Under the illustrated simulation conditions, the center-of-mass response settles after the initial impact, with small subsequent fluctuations and a smooth recovery of body attitude."
    },
    "media": {
      "type": "video",
      "src": "care-obstacle.mp4",
      "poster": "care-obstacle.webp"
    }
  }
],
  },
  {
    id: 'grooming', number: '02', year: '2026', image: 'grooming.webp',
    background: {"zh": "面向家庭智能机器人在个人卫生与日常护理场景中的应用，传统男士面部护理往往需要在热敷、涂抹、剃须、清洁等多个工具和步骤之间反复切换，同时面部曲面差异也提高了自动化操作的难度。因此，本项目尝试将多项护理流程集成到一套机器人系统中，通过多轴执行机构、自适应贴合机构以及耗材集中管理，实现从护理准备、面部操作到刀具清洁的连续化与自动化。", "en": "In domestic robotics for personal hygiene and daily care, conventional facial grooming requires repeated switching between tools and steps for warm compresses, product application, shaving and cleaning. Differences in facial contours also make automation more difficult. This project seeks to integrate these care processes into one robotic system. Multi-axis actuation, adaptive contact mechanisms and centralized consumables management support a continuous, automated workflow from preparation and facial treatment to tool cleaning."},
    methods: [
  {
    "title": {
      "zh": "四轴面部工作空间覆盖",
      "en": "Four-axis coverage of the facial workspace"
    },
    "text": {
      "zh": "针对自动护理过程中不同工具需要在复杂面部曲面上准确定位的问题，在保证能够覆盖用户面部工作区的前提下，构建由双滚珠丝杠滑台、圆弧导轨、伸缩模组及旋转模组组成的四轴执行机构。通过直线、弧线、伸缩与姿态调节自由度组合，使末端工具能够完成面部区域的扫掠与定位。",
      "en": "To position different tools accurately over complex facial surfaces during automated care, a four-axis mechanism combines a dual-ball-screw slide, an arcuate guide, a telescopic module and a rotary module to cover the facial workspace. Linear, arcuate, extension and orientation degrees of freedom allow the end tool to sweep and position itself across the face."
    }
  },
  {
    "title": {
      "zh": "耗材集中管理与流程集成",
      "en": "Centralized consumables and workflow integration"
    },
    "text": {
      "zh": "针对纸巾、护理液、剃须材料及废弃物分散布置会增加机构复杂度的问题，采用模块化储料盘集中管理耗材与废料。通过储料盘旋转完成工位切换，并配合工具平台直线移动执行取材、放置和弃材，使不同护理步骤共享同一套物料管理系统，降低整机空间与动作链复杂度。",
      "en": "A modular storage tray centralizes tissues, care liquids, shaving materials and waste to avoid the mechanical complexity of distributed storage. Tray rotation selects stations, while linear tool-platform travel handles pickup, placement and disposal. Different care steps share one material-management system, reducing space requirements and motion-chain complexity."
    }
  },
  {
    "title": {
      "zh": "柔顺裹面与刀网自拆装",
      "en": "Compliant facial wrapping and automatic foil attachment"
    },
    "text": {
      "zh": "针对面部轮廓个体差异，设计欠驱动柔顺裹面机构：机构首先沿圆弧导轨接近面部，再通过末端欠驱夹持结构逐级贴合，实现对不同脸型的自适应包覆。针对剃须后刀网清洗问题，在刀网上集成圆柱凸轮式机械接口，利用刀网与机身、清洗底盘之间的相对运动实现自动解锁、脱离与重新接合。",
      "en": "An underactuated compliant wrapping mechanism accommodates differences in facial contours. It first approaches along the arcuate guide, then progressively conforms through the underactuated end gripper to adapt to different face shapes. For cleaning the shaving foil, an integrated cylindrical-cam mechanical interface uses relative motion between the foil, body and cleaning base to unlock, detach and reconnect automatically."
    }
  },
  {
    "title": {
      "zh": "人机安全与结构校核",
      "en": "Human–machine safety and structural verification"
    },
    "text": {
      "zh": "面向直接接触人体的使用场景，将安全约束前置到机构设计中：纸巾采用蒸汽间接加热改善温度分布，与人体接触的执行端采用柔性材料、顺应结构或刀网隔离，降低刚性部件直接接触风险。同时利用 ANSYS 对关键轮系及承载零部件进行应力、变形与安全系数分析，验证关键机构的结构可靠性。",
      "en": "Safety constraints are incorporated from the start for direct human contact. Indirect steam heating improves tissue temperature distribution, while flexible materials, compliant structures or shaving-foil barriers reduce direct contact with rigid parts. ANSYS analyses of stress, deformation and factors of safety in key gear trains and load-bearing parts assess the structural reliability of the mechanisms."
    }
  }
],
    title: b('锋度绅士', 'Gentleman Grooming'),
    subtitle: b('男士面部护理机器人', 'Automated facial care concept'),
    category: b('欠驱动机构 · 柔顺接触', 'Underactuated mechanisms · Compliant contact'),
    description: b('将圆弧导轨、多轴运动与欠驱动机构结合，探索面部护理中的轨迹覆盖、柔顺贴合与工具拆洗。', 'Combining curved guides, multi-axis motion and underactuated mechanisms for facial coverage, compliant contact and removable tools.'),
    date: b('2026.04 — 2026.08', 'Apr — Aug 2026'),
    tools: ['SolidWorks', 'Adams', 'Ansys'],
    summary: {
  "highlights": [
    {
      "zh": "四轴覆盖：组合直线、圆弧、伸缩与旋转运动，定位面部工具。",
      "en": "Four-axis coverage: linear, arcuate, telescopic and rotary motion position tools across the face."
    },
    {
      "zh": "柔顺贴合：欠驱动裹面机构适应不同面部轮廓。",
      "en": "Compliant contact: an underactuated wrapping mechanism adapts to facial contours."
    },
    {
      "zh": "流程集成：旋转储料盘管理耗材，凸轮接口实现刀网自动拆装。",
      "en": "Workflow integration: a rotary tray manages consumables, and a cam interface enables automatic foil removal and reattachment."
    }
  ],
  "status": {
    "zh": "已形成整机三维模型与机构演示，开展动力学分析及关键零部件应力、变形和安全系数校核；当前成果以机构设计和数字化验证为主。",
    "en": "The work includes a full CAD model and mechanism demonstrations, dynamics analyses, and stress, deformation and factor-of-safety checks for key parts. Current results focus on mechanism design and digital verification."
  }
},
    brief: {"zh": "将热敷、剃须与清洁衔接为连续护理流程，重点解决工具在面部曲面上的定位、不同脸型的柔顺贴合，以及护理耗材管理和刀网清洗后的拆装。", "en": "Connect warm compresses, shaving and cleaning into one care workflow. The main challenges are tool positioning over facial surfaces, compliant adaptation to different face shapes, consumables handling and shaving-foil removal and reattachment for cleaning."},
    contribution: {"zh": "担任队长，负责整机机械方案与三维建模；完成移动底盘、四轴执行模组、圆弧伸缩式裹面机构及刀网自主拆装结构设计，并开展相关动力学分析。", "en": "As team lead, I developed the overall mechanical concept and CAD model, designed the mobile base, four-axis positioning module, curved telescopic wrapping mechanism and automatic foil attachment system, and performed related dynamics analyses."},
    sections: [
  {
    "title": {
      "zh": "功能创新",
      "en": "Functional innovation"
    },
    "text": {
      "zh": "设计剃须四轴模块与护理三轴模块，针对护理机器人洁面剃须时男士面部轮廓复杂的问题，通过Intel D435相机面部扫描及通过多机构配合实现对面部的修理和清洁。",
      "en": "A four-axis shaving module and a three-axis care module address the complex contours of the male face. Facial scanning with an Intel D435 camera and coordinated mechanisms support facial grooming and cleaning."
    },
    "media": {
      "type": "video",
      "src": "grooming-detail-1.mp4",
      "poster": "grooming-detail-1.webp"
    }
  },
  {
    "title": {
      "zh": "机构创新",
      "en": "Mechanism innovation"
    },
    "text": {
      "zh": "设计的新型可自主拆卸式的刀网搭配高频震动清洗平台，实现刀具的可循环换洗，采用柔性欠驱机构：人脸部的4自由度自适应欠驱包裹仅使用一对电机完成。",
      "en": "A newly designed self-detaching shaving foil works with a high-frequency vibration cleaning platform for repeated tool exchange and washing. A compliant underactuated mechanism provides four degrees of adaptive facial wrapping using only a pair of motors."
    },
    "media": {
      "type": "video",
      "src": "grooming-detail-2.mp4",
      "poster": "grooming-detail-2.webp"
    }
  },
  {
    "title": {
      "zh": "结构创新",
      "en": "Structural innovation"
    },
    "text": {
      "zh": "面部护理机器人的三大核心机构：自适应裹面机构、动态剃须洁面的多轴模块、可循环换洗机构进行结构创新设计。同时使用模块化设计较好地解决了物品管理麻烦的问题。",
      "en": "The facial care robot introduces structural innovations in three core mechanisms: adaptive facial wrapping, a multi-axis module for dynamic shaving and cleansing, and a repeatable exchange-and-wash mechanism. Modular design also simplifies the organization of care items."
    },
    "media": {
      "type": "video",
      "src": "grooming-detail-3.mp4",
      "poster": "grooming-detail-3.webp"
    }
  }
],
  },
  {
    id: 'printer', number: '03', year: '2025', image: 'printer-cover.webp', demoPoster: 'printer-cover.webp',
    background: {"zh": "面向家庭服务场景下个性化食品制作与智能烹饪需求，食品3D打印能够提供更加灵活的造型与食材组合方式，但传统设备在多材料切换、设备占地、食品残留清洗及模块维护方面仍存在不足。基于此，本项目希望设计一款更适合家庭环境使用的食品3D打印设备，通过多料筒切换、可折叠龙门架与模块化可拆洗结构，在保证打印功能的同时提升设备的空间利用率、清洁便利性与使用灵活性。", "en": "For personalized food preparation and smart cooking at home, food 3D printing offers flexible shapes and ingredient combinations. Conventional equipment still has limitations in material switching, footprint, food-residue removal and module maintenance. This project therefore aims to develop a food 3D printer better suited to domestic use. Multiple switchable cartridges, a folding gantry and modular washable components are intended to improve space efficiency, ease of cleaning and flexibility while retaining printing functionality."},
    methods: [
  {
    "title": {
      "zh": "四工位送料与换料耦合",
      "en": "Coupled four-station feeding and material switching"
    },
    "text": {
      "zh": "针对多材料打印中独立送料机构数量多、换料定位误差及食材残留的问题，采用“四料筒—单推杆”架构。各料筒使用可拆卸螺旋推杆完成定量挤出，并通过棘轮机构实现四工位 90°分度定位；结合齿轮传动与离合机构切换动力路径，使单套电机模组即可完成送料与换料两种动作，减少驱动数量和结构复杂度。",
      "en": "A four-cartridge, single-pushrod architecture addresses the number of independent feeders, indexing errors during material changes and food residue in multi-material printing. Detachable screw pushrods provide metered extrusion, while a ratchet mechanism indexes the four stations in 90° increments. Gearing and a clutch switch the power path so one motor module performs both feeding and material switching, reducing actuator count and mechanical complexity."
    }
  },
  {
    "title": {
      "zh": "折叠龙门与空间重构",
      "en": "Folding gantry and spatial reconfiguration"
    },
    "text": {
      "zh": "针对传统龙门式打印设备待机状态占用空间较大的问题，设计滑块式四连杆折叠机构，通过丝杠提供稳定的线性输入，将滑块位移转换为龙门架约90°翻转。关键位置增加辅助连杆形成冗余支撑与运动约束，在控制折叠自由度的同时提高展开状态下的结构稳定性。",
      "en": "To reduce the idle footprint of a conventional gantry printer, a slider-based four-bar folding mechanism converts stable lead-screw-driven linear travel into approximately 90° of gantry rotation. Auxiliary links at key locations provide additional support and motion constraints, controlling the folding degree of freedom while improving stability in the deployed configuration."
    }
  },
  {
    "title": {
      "zh": "模块化与可清洁设计",
      "en": "Modularity and cleanability"
    },
    "text": {
      "zh": "考虑食品设备对拆洗、存储和耗材更换的要求，将料筒、推杆及送料单元设计为可快速拆卸模块，减少食材进入复杂传动结构的可能。料筒既可作为整机换料模块工作，也可独立拆出接入其他打印平台，提高模块复用性，并降低使用后的清洁维护成本。",
      "en": "Cartridges, pushrods and feeding units are designed as quick-removal modules to support washing, storage and consumable replacement while reducing the likelihood of food entering complex transmission mechanisms. Cartridges can serve as material-change modules in the complete printer or be removed for use on other printing platforms, improving reuse and reducing cleaning and maintenance effort."
    }
  },
  {
    "title": {
      "zh": "结构与食品接触安全验证",
      "en": "Structural and food-contact safety validation"
    },
    "text": {
      "zh": "针对折叠龙门、送料组件及料筒在工作过程中的承载问题，利用 SolidWorks Simulation 对关键杆组和送料部件进行应力、变形及安全系数分析，对薄弱位置进行结构修正；与食品直接接触的零部件采用食品接触级材料，从结构强度与卫生安全两个维度约束设计。",
      "en": "SolidWorks Simulation evaluates stress, deformation and factors of safety in key linkages and feeding components under operating loads on the folding gantry, feeder assemblies and cartridges. Weak regions are revised accordingly. Parts in direct contact with food use food-contact-grade materials, making structural strength and hygiene joint design constraints."
    }
  }
],
    title: b('食界巧味', 'FoodCraft'),
    subtitle: b('可折叠多材料食品打印机', 'Foldable multi-material food printer'),
    category: b('连杆设计 · 多材料切换', 'Linkage design · Material switching'),
    description: b('围绕家庭收纳和多材料打印，设计可翻转龙门架与送料换料一体化机构，让复杂功能落在具体结构上。', 'A folding gantry and integrated feeding-and-switching mechanism designed around home storage and multi-material food printing.'),
    date: b('2025', '2025'),
    tools: ['SolidWorks', 'MATLAB', 'Ansys'],
    summary: {
  "highlights": [
    {
      "zh": "折叠收纳：滑块式四连杆带动龙门架约 90° 翻转。",
      "en": "Folding storage: a slider-based four-bar linkage rotates the gantry by approximately 90°."
    },
    {
      "zh": "驱动复用：四料筒—单推杆架构耦合送料与 90° 分度换料。",
      "en": "Shared actuation: four cartridges and one pushrod combine feeding with 90° indexed material changes."
    },
    {
      "zh": "模块化拆洗：料筒、推杆与送料单元可快速拆卸及复用。",
      "en": "Modular cleaning: cartridges, pushrods and feeding units support quick removal and reuse."
    }
  ],
  "status": {
    "zh": "已形成整机数字样机与机构动画，并对关键杆组和送料部件开展应力、变形及安全系数分析；展示重点为结构方案、运动配合与可拆卸设计。",
    "en": "The work includes a full digital prototype, mechanism animations, and stress, deformation and factor-of-safety analyses of key linkages and feeding parts. The presentation focuses on structural design, coordinated motion and disassembly."
  }
},
    brief: {"zh": "面向家用多材料食品打印，解决设备收纳占地大、送料与换料机构繁多，以及食材接触部件拆洗不便的问题，在紧凑结构中组织打印、换料和清洁需求。", "en": "Address the storage footprint, numerous feeding and switching mechanisms, and difficult cleaning of food-contact parts in a home multi-material food printer. The design combines printing, material changes and cleaning access within a compact structure."},
    contribution: {"zh": "担任队长，负责机械结构方案与三维建模，重点完成可折叠龙门架、四工位换料机构，以及送料与换料一体化料筒的设计。", "en": "As team lead, I developed the mechanical concept and CAD model, focusing on the folding gantry, four-station material-switching mechanism and integrated feeding and switching cartridge assembly."},
    sections: [
  {
    "title": {
      "zh": "精准与均匀送料",
      "en": "Precise, uniform feeding"
    },
    "text": {
      "zh": "采用螺旋压力送料系统，推动食材稳定挤出，使送料更加精准、均匀，并降低通道堵塞风险。",
      "en": "A screw-pressure feeding system drives steady food extrusion for more precise, uniform delivery while reducing the risk of blocked channels."
    },
    "media": {
      "type": "video",
      "src": "printer-feed.mp4",
      "poster": "printer-feed.webp"
    }
  },
  {
    "title": {
      "zh": "自动换料设计",
      "en": "Automatic material switching"
    },
    "text": {
      "zh": "通过单棘轮机构实现90°分度定位，配合送料与换料机构完成不同料筒之间的切换，支持多材料打印。",
      "en": "A single-ratchet mechanism provides 90° indexing. Coordinated feeding and switching mechanisms select between cartridges to support multi-material printing."
    },
    "media": {
      "type": "video",
      "src": "printer-switch.mp4",
      "poster": "printer-switch.webp"
    }
  },
  {
    "title": {
      "zh": "旋转收纳设计",
      "en": "Rotating storage design"
    },
    "text": {
      "zh": "采用滑块式四连杆机构，使龙门架在工作与收纳形态之间完成90°翻转，减少闲置占用空间，提高空间利用率。",
      "en": "A slider-driven four-bar linkage rotates the gantry through 90° between working and storage configurations, reducing its idle footprint and making better use of space."
    },
    "media": {
      "type": "video",
      "src": "printer-fold.mp4",
      "poster": "printer-fold.webp"
    }
  },
  {
    "title": {
      "zh": "模块化设计",
      "en": "Modular design"
    },
    "text": {
      "zh": "内部机构与料筒采用接触式连接，小料筒通过螺纹连接实现拆卸清洁，并支持更换不同孔径喷头。结合 ULTEM 1010、食品级硅胶及 PP 的材料方案，兼顾维护便利性与食品接触部件的使用需求。",
      "en": "Contact interfaces connect the internal mechanism and cartridges, while threaded connections allow the small cartridges to be removed for cleaning. Nozzles with different outlet diameters can be exchanged. The proposed use of ULTEM 1010, food-grade silicone and PP addresses maintenance needs and the requirements of food-contact components."
    },
    "media": {
      "type": "carousel",
      "id": "printer-modular",
      "intervalMs": 1000,
      "items": [
        {
          "type": "image",
          "src": "printer-material.webp",
          "alt": {
            "zh": "材料与模块分解图",
            "en": "Materials and module breakdown"
          }
        },
        {
          "type": "video",
          "src": "printer-modular.mp4",
          "poster": "printer-modular.webp",
          "alt": {
            "zh": "模块化设计演示",
            "en": "Modular design demonstration"
          }
        }
      ]
    }
  }
],
  },
  {
    id: 'frog', number: '04', year: '2026', image: 'frog-cover.webp', ongoing: true,
    background: {"zh": "项目面向厨房端小型全自动牛蛙加工设备的开发需求，目标是将牛蛙进入设备后的固定、切割、去皮、开膛、去脏、分切及清洗等多道加工步骤整合到一套连续机械系统中。项目因此以多工序协同和结构集成为核心，围绕姿态摆正、稳定夹持、开膛去脏及皮肉分离等关键环节进行机构设计，希望减少工序之间的重复定位，并在有限设备空间内实现连续化、自动化加工。", "en": "This project addresses the need for a compact, fully automated bullfrog-processing machine for kitchen use. It aims to integrate securing, cutting, skinning, abdominal opening, evisceration, portioning and washing into one continuous mechanical system after the bullfrog enters the machine. The design therefore focuses on coordinating multiple operations and integrating structures, particularly orientation correction, stable clamping, opening and evisceration, and skin–meat separation. The goal is to reduce repeated positioning between stages and enable continuous automated processing within a limited equipment footprint."},
    methods: [
  {
    "title": {
      "zh": "加工流程分解与模块重构",
      "en": "Process decomposition and module reconfiguration"
    },
    "text": {
      "zh": "针对人工牛蛙加工中姿态不统一、工序分散及连续加工困难的问题，首先将完整作业流程拆解为送料、姿态摆正、夹持定位、开膛去脏及皮肉分离等功能模块，并围绕各工序之间的姿态传递关系进行整机机构配置，使多个独立动作能够在统一加工流程中连续衔接。",
      "en": "To address inconsistent orientation, fragmented operations and difficulties with continuous manual bullfrog processing, the workflow is divided into feeding, orientation correction, clamping and positioning, abdominal opening and evisceration, and skin–meat separation. The overall mechanism is arranged around orientation transfer between stages so separate actions connect continuously within one process."
    }
  },
  {
    "title": {
      "zh": "单输入多滑块姿态摆正",
      "en": "Single-input, multi-slider orientation correction"
    },
    "text": {
      "zh": "针对牛蛙来料姿态随机、个体尺寸存在差异的问题，设计单输入多滑块联动机构。利用单一驱动同步控制多个校正单元，通过机械联动将不同初始状态的牛蛙逐步约束至目标加工姿态，减少独立执行器数量，同时保证后续夹持和加工工位的位置一致性。",
      "en": "A single-input, multi-slider linkage addresses random incoming orientations and variations in body size. One actuator synchronizes multiple correction units, progressively constraining different starting orientations into the target processing posture. This reduces independent actuator count while maintaining positional consistency for subsequent clamping and processing stations."
    }
  },
  {
    "title": {
      "zh": "夹持与开膛去脏协同",
      "en": "Coordinated clamping, opening and evisceration"
    },
    "text": {
      "zh": "针对柔性生物体固定困难以及开膛、去脏动作分离导致机构链过长的问题，设计柔性夹持定位机构，并将丝杠滑台、刀具组与导向轨道集成为开膛去脏模块。通过刀具运动轨迹与引导结构协同，使开膛过程中同步完成内脏分离，减少重复定位和工序转换。",
      "en": "A compliant clamping and positioning mechanism addresses the difficulty of securing a flexible biological body. A lead-screw slide, tool set and guide tracks are integrated into one opening and evisceration module to shorten the mechanism chain. Coordinating tool trajectories with guiding structures enables organ separation during abdominal opening, reducing repeated positioning and transfers between operations."
    }
  },
  {
    "title": {
      "zh": "结构强度与运动可行性验证",
      "en": "Structural strength and motion feasibility validation"
    },
    "text": {
      "zh": "围绕摆正机构、夹持结构及开膛模块的关键承载零部件开展数字化验证，利用 SolidWorks Simulation 分析典型工况下的应力、变形和安全裕度，并结合机构运动关系检查行程、干涉及极限位置，为杆件尺寸、安装位置及局部结构优化提供依据。",
      "en": "Digital verification focuses on key load-bearing parts in the orientation, clamping and abdominal-opening mechanisms. SolidWorks Simulation assesses stress, deformation and safety margins under representative operating conditions. Kinematic relationships are also used to check travel, interference and limiting positions, informing link dimensions, mounting locations and local structural optimization."
    }
  }
],
    title: b('蛙鲜速剥', 'Frog Processing System'),
    subtitle: b('多模块自动化牛蛙加工装置', 'Modular automated processing concept'),
    category: b('自动化设备 · 多机构协同', 'Automation · Mechanism coordination'),
    description: b('围绕姿态摆正、夹持定位与加工动作，组织多模块机构的协同，探索连续加工设备的结构方案。', 'Coordinating orientation, clamping and processing mechanisms in a modular concept for continuous automated processing.'),
    date: b('2026.07 — 至今', 'Jul 2026 — Present'),
    tools: ['SolidWorks', 'SolidWorks Simulation'],
    summary: {
  "highlights": [
    {
      "zh": "姿态统一：单输入多滑块联动，协同约束不同来料姿态。",
      "en": "Orientation control: a single-input multi-slider linkage coordinates correction of varying incoming postures."
    },
    {
      "zh": "工序协同：柔性夹持配合刀具轨迹，将开膛与去脏集成。",
      "en": "Process coordination: compliant clamping and coordinated tool paths integrate abdominal opening and evisceration."
    },
    {
      "zh": "模块衔接：围绕工序间姿态传递配置送料、夹持与加工机构。",
      "en": "Module integration: feeding, clamping and processing mechanisms are arranged around posture transfer between stages."
    }
  ],
  "status": {
    "zh": "项目进行中。已形成整机结构方案、三维模型和机构动画，并开展关键承载零部件有限元分析及行程、干涉检查；当前持续完善模块之间的运动配合。",
    "en": "In progress. The work includes an overall mechanical concept, CAD model and mechanism animations, with finite element analysis of key load-bearing parts and travel and interference checks. Coordination between modules is being refined."
  }
},
    brief: {"zh": "针对牛蛙来料姿态不统一、人工工序分散的问题，将送料、摆正、夹持、开膛去脏及皮肉分离组织为连续加工流程，减少工序间反复定位与转移。", "en": "Organize feeding, orientation correction, clamping, abdominal opening and evisceration, and skin–meat separation into a continuous process. The aim is to address inconsistent incoming orientation and fragmented manual operations while reducing repeated positioning and transfers."},
    contribution: {"zh": "担任队长，负责机械结构方案与三维建模；完成姿态摆正和开膛去脏机构设计，提出单输入多滑块联动方案与环切夹头，并开展模块有限元分析。", "en": "As team lead, I developed the mechanical concept and CAD model, designed the orientation-correction and opening/evisceration mechanisms, proposed a single-input multi-slider linkage and ring-cut clamping concept, and carried out module-level finite element analysis."},
    sections: [
  {
    "title": {
      "zh": "模块化一体化设计",
      "en": "Integrated modular design"
    },
    "text": {
      "zh": "本产品通过模块化设计，实现了从活蛙到开膛、去内脏、去皮和收集的一体化流程，具有自动化程度高，占用空间小等优点。",
      "en": "The modular design integrates the workflow from live frogs through opening, evisceration, skin removal and collection, with a high degree of automation and a compact footprint."
    },
    "media": {
      "type": "image",
      "src": "frog-structure.webp"
    }
  },
  {
    "title": {
      "zh": "摆正与夹头机构创新",
      "en": "Orientation and clamping innovation"
    },
    "text": {
      "zh": "通过摆正机构与夹头机构对牛蛙进行姿态调整，采用环切夹头装置对牛蛙进行柔性固定，其结构简单合理，定位精度高。",
      "en": "Orientation and clamping mechanisms adjust the frog’s posture. A ring-cut clamping device provides compliant fixation, using a simple, practical structure for precise positioning."
    },
    "media": {
      "type": "video",
      "src": "frog-detail-1.mp4",
      "poster": "frog-detail-1.webp"
    }
  },
  {
    "title": {
      "zh": "多工位往复加工创新",
      "en": "Multi-station reciprocating processing"
    },
    "text": {
      "zh": "采用多工位往复的加工方式，并且将丝杆滑台、刀具组、引导轨道组合成开膛去内脏模块，实现了牛蛙在开膛的同时去除内脏，简化工作流程，提高加工效率。方案所述加工节拍为3~4秒/只。",
      "en": "Multi-station reciprocating processing combines a lead-screw stage, tool assembly and guide tracks into an opening and evisceration module. Simultaneous opening and evisceration simplify the workflow and improve processing efficiency. The supplied design describes a cycle time of 3–4 seconds per frog."
    },
    "media": {
      "type": "video",
      "src": "frog-detail-2.mp4",
      "poster": "frog-detail-2.webp"
    }
  }
],
  },
];

export const awards = [
  {id:1, year:2026, level:'national', title:b('中国大学生机械工程创新创意大赛','Chinese College Students Mechanical Engineering Innovation Competition'), prize:b('全国二等奖','National Second Prize'), work:b('安伴智护 · 机械产品数字化设计赛','Anban Care · Digital Mechanical Product Design')},
  {id:14, year:2026, level:'national', title:b('第九届中国高校智能机器人创意大赛','9th China University Intelligent Robot Creative Competition'), prize:b('全国二等奖','National Second Prize'), work:b('锋度绅士 · 男士面部护理机器人','Gentleman Grooming · Facial Care Robot')},
  {id:8, year:2026, level:'national', title:b('睿抗机器人开发者大赛（RAICOM）','RAICOM Robotics Developer Competition'), prize:b('全国二等奖','National Second Prize'), work:b('物流挑战竞赛','Logistics Challenge')},
  {id:2, year:2026, level:'regional', title:b('中国大学生智能装备创新设计大赛','College Students Intelligent Equipment Design Competition'), prize:b('区域赛一等奖','Regional First Prize'), work:b('灵筑安伴 · 多构型老人陪护机器人','Lingzhu Companion · Reconfigurable Care Robot')},
  {id:15, year:2026, level:'regional', title:b('湖北省大学生智能机器人创意竞赛','Hubei College Students Intelligent Robot Creative Competition'), prize:b('省级一等奖','Provincial First Prize'), work:b('锋度绅士 · 男士面部护理机器人','Gentleman Grooming · Facial Care Robot')},
  {id:6, year:2026, level:'regional', title:b('睿抗机器人开发者大赛（RAICOM）','RAICOM Robotics Developer Competition'), prize:b('湖北赛区一等奖','Hubei First Prize'), work:b('物流挑战竞赛','Logistics Challenge')},
  {id:11, year:2026, level:'regional', title:b('湖北省大学生智能机器人创意竞赛','Hubei College Students Intelligent Robot Creative Competition'), prize:b('省级二等奖','Provincial Second Prize'), work:b('CareBox 多功能自助药箱','CareBox · Multifunctional Medicine Box')},
  {id:3, year:2025, level:'national', title:b('全国三维数字化创新设计大赛','National 3D Digital Innovation Design Competition'), prize:b('全国一等奖','National First Prize'), work:b('食绘巧创打印机','Food Printer Design')},
  {id:17, year:2025, level:'national', title:b('第八届中国高校智能机器人创意大赛','8th China University Intelligent Robot Creative Competition'), prize:b('全国二等奖','National Second Prize'), work:b('食界巧味打印机','FoodCraft Printer')},
  {id:7, year:2025, level:'national', title:b('机械设计基础类课程实践作品竞赛','Mechanical Design Fundamentals Practical Works Competition'), prize:b('二等奖','Second Prize'), work:b('整机机构类 · 设计分析类','Mechanism Design & Analysis')},
  {id:10, year:2025, level:'national', title:b('第十三届全国大学生数字媒体科技作品及创意竞赛','13th National College Student Digital Media Technology & Creativity Competition'), prize:b('全国三等奖','National Third Prize'), work:b('智绘食光 · 数媒家用 3D 食品打印机','Digital Home 3D Food Printer')},
  {id:13, year:2025, level:'national', title:b('第八届中国高校智能机器人创意大赛','8th China University Intelligent Robot Creative Competition'), prize:b('全国三等奖','National Third Prize'), work:b('腰肌劳损康养椅','Lumbar Rehabilitation Chair')},
  {id:19, year:2025, level:'national', title:b('第十八届“高教杯”全国大学生先进成图技术与产品信息建模创新大赛','18th National Advanced Engineering Drawing & Product Information Modeling Competition'), prize:b('全国三等奖','National Third Prize'), work:b('机械类 · 先进成图技术赛道','Mechanical Engineering · Advanced Drawing')},
  {id:5, year:2025, level:'regional', title:b('全国三维数字化创新设计大赛','National 3D Digital Innovation Design Competition'), prize:b('湖北赛区特等奖','Hubei Grand Prize'), work:b('食绘巧创打印机','Food Printer Design')},
  {id:16, year:2025, level:'regional', title:b('湖北省大学生智能机器人创意竞赛','Hubei College Students Intelligent Robot Creative Competition'), prize:b('省级一等奖','Provincial First Prize'), work:b('食界巧味打印机','FoodCraft Printer')},
  {id:12, year:2025, level:'regional', title:b('湖北省大学生智能机器人创意竞赛','Hubei College Students Intelligent Robot Creative Competition'), prize:b('省级一等奖','Provincial First Prize'), work:b('腰肌劳损康养椅','Lumbar Rehabilitation Chair')},
  {id:18, year:2025, level:'regional', title:b('湖北省第五届大学生先进成图技术与产品信息建模创新大赛','5th Hubei Advanced Drawing & Product Information Modeling Competition'), prize:b('省级一等奖','Provincial First Prize'), work:b('机械类','Mechanical Engineering')},
  {id:4, year:2025, level:'regional', title:b('全国三维数字化创新设计大赛','National 3D Digital Innovation Design Competition'), prize:b('湖北赛区二等奖','Hubei Second Prize'), work:b('腰肌劳损康养椅','Lumbar Rehabilitation Chair')},
  {id:9, year:2025, level:'regional', title:b('第十三届全国大学生数字媒体科技作品及创意竞赛','13th National College Student Digital Media Technology & Creativity Competition'), prize:b('湖北赛区二等奖','Hubei Second Prize'), work:b('智绘食光 · 数媒家用 3D 食品打印机','Digital Home 3D Food Printer')},
];

export const patents = [
  {id:'2025115145660', title:b('料筒结构和多功能食品 3D 打印机','Cartridge Structure and Multifunctional Food 3D Printer'), number:'CN 121286731 A', date:'2026.01.09'},
  {id:'2025115145707', title:b('多功能食品 3D 打印机','Multifunctional Food 3D Printer'), number:'CN 121445106 A', date:'2026.02.03'},
];

// 首页流动横幅：速度单位为像素/秒；词语在中英文页面保持相同拼写。
export const homeSkills = {
  speed: 35,
  words: ['SOLIDWORKS', 'UG/NX', 'AUTOCAD', 'ANSYS', 'ADAMS', 'MATLAB', 'FUSION360', 'AI-ASSISTEDENG', 'TOPOLOGY STUDY', 'TEAMMANAGEMENT'],
};
export const experience = {
  label: b('职业足迹', 'EXPERIENCE'),
  title: b('工作经历', 'Work experience'),
  placeholder: b('敬请期待', 'Coming soon'),
};
