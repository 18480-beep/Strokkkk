/*
 * Scene Data Configuration
 * Design: "Surgical Theater" — Dark Cinematic Medical Realism
 * Each scene represents a step in the anatomical journey from face to stroke
 */

export interface SceneData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  facts?: string[];
}

export const SCENES: SceneData[] = [
  {
    id: 0,
    slug: "แนะนำ",
    title: "ฟื้นฟูสโตรก",
    subtitle: "แอปนี้เพื่อ",
    description:
      "Every stroke begins beneath the surface. We start with the human head — a complex structure housing the most vital organ. Scroll down to begin your journey into the anatomy of stroke.",
    image:
      "https://img2.pic.in.th/impvest_one_pager.pdf-2.png",
    accentColor: "#fff243",
    facts: [
      "The brain receives 20% of the body's blood supply",
      "15% of cardiac output goes directly to the brain",
      "The brain uses about 20% of the body's oxygen",
    ],
  },
  {
    id: 1,
    slug: "การฝึก",
    title: "Beneath the Surface",
    subtitle: "Skin → Skull Transition",
    description:
      "As we dissolve through the skin, the skull emerges — the brain's protective fortress. The cranium shields the delicate neural tissue from external forces, but it cannot protect against threats from within.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/human-head-anatomy-eiaFNCh2tyrdTpXMJVrTnX.png",
    accentColor: "#ff4d00",
    facts: [
      "The skull consists of 22 bones",
      "Cranial bones are fused by sutures",
      "The skull protects the brain from physical trauma",
    ],
  },
  {
    id: 2,
    slug: "brain",
    title: "The Brain Revealed",
    subtitle: "Command Center of Life",
    description:
      "The brain — weighing only 1.4 kg — controls every function of the human body. Its intricate folds (gyri and sulci) maximize surface area, housing billions of neurons that form the most complex network in the known universe.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/hero-brain-glow-YVjbBrSJYKTUrH34WNE8ff.webp",
    accentColor: "#00D4AA",
    facts: [
      "The brain contains ~86 billion neurons",
      "Cerebrum: controls thought, movement, sensation",
      "Cerebellum: coordinates balance and movement",
      "Brainstem: manages vital functions like breathing",
    ],
  },
  {
    id: 3,
    slug: "vessels",
    title: "Vascular Network",
    subtitle: "Rivers of Life",
    description:
      "The cerebral vascular system delivers oxygen-rich blood to every region of the brain. The Circle of Willis acts as a critical junction, distributing blood through anterior, middle, and posterior cerebral arteries.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/blood-vessels-network-Ti3FUDdfz6ZVpE9ovaLAJJ.webp",
    accentColor: "#FF2020",
    facts: [
      "~400 miles of blood vessels in the brain",
      "Blood flow: ~750 mL per minute",
      "Circle of Willis provides collateral circulation",
      "Neurons die within minutes without oxygen",
    ],
  },
  {
    id: 4,
    slug: "ischemic",
    title: "Ischemic Stroke",
    subtitle: "When Blood Flow Stops",
    description:
      "An ischemic stroke occurs when a blood clot blocks an artery supplying the brain. The affected region is starved of oxygen, and brain cells begin to die within minutes. This is the most common type, accounting for ~87% of all strokes.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/ischemic-stroke-event-XgmhRoaQFfXnSZo5d4dWit.webp",
    accentColor: "#FF6B00",
    facts: [
      "87% of all strokes are ischemic",
      "1.9 million neurons die every minute during stroke",
      "Tissue plasminogen activator (tPA) can dissolve clots",
      "Treatment window: within 4.5 hours of onset",
    ],
  },
  {
    id: 5,
    slug: "hemorrhagic",
    title: "Hemorrhagic Stroke",
    subtitle: "When Vessels Rupture",
    description:
      "A hemorrhagic stroke occurs when a weakened blood vessel ruptures, leaking blood into the brain tissue. The expanding blood pool creates pressure that damages surrounding neurons. Though less common, it is often more severe.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/hemorrhagic-stroke-event-XzV7xGQujWcG7qXczumg6S.webp",
    accentColor: "#FF2020",
    facts: [
      "13% of strokes are hemorrhagic",
      "Mortality rate: 40% within first month",
      "High blood pressure is the leading cause",
      "Surgery may be needed to relieve pressure",
    ],
  },
  {
    id: 6,
    slug: "impact",
    title: "Impact & Recovery",
    subtitle: "Recognizing the Signs — Act F.A.S.T.",
    description:
      "Stroke can cause devastating effects depending on the affected brain region. Recognizing symptoms quickly is critical — every minute counts. Remember F.A.S.T.: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663606879672/MXVKFDVN9tF6BUuQHFXUDG/hero-brain-glow-8nJsLHHXAqyY4xN5Vsv2Qw.png",
    accentColor: "#00D4AA",
    facts: [
      "F — Face drooping on one side",
      "A — Arm weakness or numbness",
      "S — Speech difficulty or slurred",
      "T — Time to call emergency services",
    ],
  },
];

export const SCENE_COUNT = SCENES.length;
