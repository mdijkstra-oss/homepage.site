import type { ContentSection } from '../features/portfolio/model/types';

export interface NavItem {
  label: string;
  href?: string;
  target?: '_blank';
  rel?: 'noopener';
}

export interface ComposerCopy {
  placeholder: string;
  send: string;
  busy: string;
}

export interface SiteCopy {
  logo: string;
  nav: readonly NavItem[];
  composer: ComposerCopy;
  thinkingWords: readonly string[];
}

export const SITE: SiteCopy = {
  logo: 'mdijkstra.dev',
  nav: [
    {
      label: 'GitHub',
      href: 'https://github.com/mdijkstra-oss/',
      target: '_blank',
      rel: 'noopener',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/matthijn-dijkstra/',
      target: '_blank',
      rel: 'noopener',
    },
    { label: 'Resume', href: '/resume.pdf' },
    { label: 'Contact', href: "mailto:hello@mdijkstra.dev?subject=Let's%20build%20something%20great" },
  ],
  composer: {
    placeholder: 'Ask anything about Matthijn',
    send: '↵ send',
    busy: '…',
  },
  thinkingWords: [
    'Thinking',
    'Pondering',
    'Mulling it over',
    'Reflecting',
    'Considering',
    'Gathering thoughts',
    'Digging in',
    'Working it out',
    'Piecing it together',
    'One sec',
  ],
};

export const SECTIONS: readonly ContentSection[] = [
  {
    id: 'profile',
    pillLabel: 'About',
    prompt: 'Who is Matthijn, in a nutshell?',
    blocks: [
      {
        type: 'profile',
        payload: {
          initials: 'MD',
          photo: 'uploads/self-480.png',
          name: 'M. Dijkstra',
          label: 'STAFF ENGINEER · ARCHITECT',
          bio: "I'm a software engineer and architect who takes responsibility for how a system fits together, how it reaches production, and how the team carries it forward. I joined PeerWell as its first full-time engineer and designed and built most of a digital therapeutics platform, then stayed through funding rounds and the 2022 acquisition to lead its integration into Bardavon and relaunch as Recovery+.",
          badge: 'AVAILABLE FOR WORK',
          availability:
            'Staff, founding & forward-deployed roles · Amsterdam · Remote/hybrid + travel · Dutch citizen · EU/US overlap',
          cta: 'Hire me →',
          note: 'usually replies same day',
          noteHover: '1 of 1 available',
          email: 'hello@mdijkstra.dev',
          emailSubject: "Let's build something great",
        },
      },
    ],
  },
  {
    id: 'experience',
    pillLabel: 'Experience',
    prompt: 'Walk me through his most significant work.',
    blocks: [
      {
        type: 'role',
        payload: {
          badge: 'FULL-TIME · HEALTHTECH',
          logo: 'uploads/peerwell.png',
          initials: '',
          name: 'PeerWell',
          meta: '2016–2022 · FIRST ENGINEER → ENGINEERING LEAD',
          paragraphs: [
            {
              text: 'Joined PeerWell in 2016 as the first full-time engineer, building a digital therapeutics platform for surgical preparation and recovery. Patients acted on its guidance and clinicians built it into care pathways.',
            },
            {
              text: 'I designed and built most of the initial platform, including the patient data model, backend services and web applications, supported by HIPAA-compliant infrastructure.',
            },
            {
              pre: 'I designed an adaptive recommendation engine that personalises recovery pathways using patient context, historical outcomes and configurable clinical scoring. Its architecture is described in published U.S. patent application ',
              linkText: 'US20180286509A1',
              url: 'https://patents.google.com/patent/US20180286509A1/en',
              post: ', on which I am a co-inventor.',
            },
            {
              text: 'I built image and pose recognition for AI-assisted movement tracking, plus an authoring tool that let the content team define exercises from sample videos without engineering becoming a content bottleneck.',
            },
            {
              text: 'As the team grew across the US and Europe, I led system design while continuing to build alongside the other engineers. I mentored engineers, ran interviews and helped set the hiring bar. Across PeerWell and Bardavon, I spent nearly ten years working remotely with teams on both sides of the Atlantic.',
            },
          ],
          stats: [
            {
              value: '26%',
              label: 'SHORTER HOSPITAL STAYS',
              note: '1',
              href: 'https://atm.amegroups.org/article/view/22734/html',
            },
            {
              value: '+80%',
              label: 'HOME DISCHARGE (RELATIVE)',
              note: '1',
              href: 'https://atm.amegroups.org/article/view/22734/html',
            },
            {
              value: '35%',
              label: 'AVERAGE PAIN REDUCTION',
              note: '2',
              href: 'https://www.bardavon.com/case-studies/peerwells-digital-lower-back-program-reduced-back-pain-by-35/',
            },
          ],
          tech: ['React', 'Node/TS', 'DocumentDB', 'Native iOS', 'Computer Vision', 'Observability', 'HIPAA'],
          cta: 'View PeerWell →',
          ctaNote: '@ internet archive',
          href: 'https://web.archive.org/web/20210610225140/https://peerwell.co/',
          footnotes: [
            {
              n: '1',
              text: 'Chughtai et al., The role of prehabilitation with a telerehabilitation system prior to total knee arthroplasty, Annals of Translational Medicine 2019;7(4). Peer-reviewed feasibility study, n=476, PeerWell PreHab program.',
              url: 'https://atm.amegroups.org/article/view/22734/html',
            },
            {
              n: '2',
              text: 'Bardavon–PeerWell Digital Lower Back Program case study. Company-published; reduced back pain by an average of 35% over a 10-week program (ODI-measured).',
              url: 'https://www.bardavon.com/case-studies/peerwells-digital-lower-back-program-reduced-back-pain-by-35/',
            },
          ],
        },
      },

      {
        type: 'role',
        payload: {
          badge: 'FULL-TIME · POST-ACQUISITION',
          logo: 'uploads/bardavon.png',
          initials: '',
          name: 'Bardavon Health Innovations',
          meta: '2022–2025 · LEAD ENGINEER, ACQUISITION INTEGRATION',
          paragraphs: [
            {
              text: "When Bardavon acquired PeerWell in 2022, I stayed on to lead the integration. I worked out what to retain and what to rebuild as the product shifted from surgical patients to injured workers. I migrated the platform onto Bardavon's infrastructure and integrated it with their visual workflow automation platform. It launched in April 2024 as Recovery+, which connects people recovering from workplace injuries with licensed clinical coaches.",
            },
            {
              text: "The integration also meant bringing together two teams with different engineering practices and assumptions about the codebase. I led that work through to full ownership by Bardavon's engineers, working alongside them on the platform and making the architecture and its decisions explicit so they could maintain and develop it independently.",
            },
            {
              text: 'The integration and handover wrapped in 2025. The measure of a good handover is that you can leave, and by then I could.',
            },
          ],
          tech: ['AWS Fargate', 'Docker', 'GitHub Actions', 'CI/CD', 'IaC/Terraform'],
          cta: 'View Recovery+ →',
          ctaNote: '@ bardavon.com',
          href: 'https://www.bardavon.com/injury-recovery/recovery-plus/',
        },
      },
    ],
  },
  {
    id: 'projects',
    pillLabel: 'Projects',
    prompt: 'Tell me about his own projects.',
    blocks: [
      {
        type: 'experience',
        payload: {
          badge: 'OPEN SOURCE',
          video: '',
          name: 'Nabu',
          meta: '2025–PRESENT · SOLO · OPEN SOURCE',
          blurb:
            'Nabu is a local-first research environment that turns source documents into structured information people can query and explore. It combines AI-assisted qualitative coding and structured data extraction with querying and document versioning. The original documents remain the source of truth, with derived data kept up to date for local analysis.',
          tech: ['React', 'DuckDB-WASM', 'Go', 'RAG/HyDE', 'Multi-model voting'],
          cta: 'View on GitHub →',
          ctaNote: 'source + docs',
          href: 'https://github.com/mdijkstra-oss/nabu-frontend',
        },
      },
    ],
  },
  {
    id: 'reviews',
    pillLabel: 'Reviews',
    prompt: "What do people who've worked with him say?",
    blocks: [
      {
        type: 'reviews',
        payload: {
          badge: 'RECOMMENDATIONS',
          title: 'What people say',
          subtitle: 'VIA LINKEDIN',
          items: [
            {
              initials: 'JG',
              name: 'Jeffrey Greenberg',
              photo: 'uploads/jeff.jpeg',
              role: 'VP of Engineering · PeerWell & Bardavon',
              url: 'https://www.linkedin.com/in/jeffreygreenberg/',
              quote:
                'Simply put, Matthijn has been a critical engineer for the success of our startup, from building the initial product, technical leadership as we grew, and then to its successful acquisition, and then continuing with the acquiring company, Bardavon, integrating code, engineers, and systems.',
            },
            {
              initials: 'MS',
              name: 'Manish Shah',
              photo: 'uploads/manish.jpeg',
              role: 'CEO of PeerWell (co-founder, Rapleaf)',
              url: 'https://www.linkedin.com/in/mnshah/',
              quote:
                'Matthijn was able to adapt to the changes quickly. This was a testament to his ability to learn quickly. And also his interests in going deep rather than being satisfied with a cursory level of knowledge. He earned more and more responsibility and was a critical part of the success of our products.',
            },
            {
              initials: 'CF',
              name: 'Carlos Frias',
              photo: 'uploads/carlos.jpeg',
              role: 'Senior Full Stack Engineer · PeerWell',
              url: 'https://www.linkedin.com/in/carlos-frias-zapater/',
              quote:
                "When I joined his team at PeerWell he had been the main driver of a whole app and platform, where cutting-edge features and solid principles had been built in. Even though it's difficult for most at that established stage, he welcomed new ideas and practices, challenging parts to the right point, and incorporating those that made most sense.",
            },
          ],
        },
      },
    ],
  },
  {
    id: 'history',
    pillLabel: 'Freelance',
    prompt: 'Where did he start out?',
    blocks: [
      {
        type: 'note',
        payload: {
          badge: 'FREELANCE',
          eyebrow: 'INDEPENDENT · 2007–2016',
          title: 'Freelance',
          paragraphs: [
            'I freelanced for close to nine years, alongside studying and later full-time work. It was the same loop repeated across very different clients: work out what someone actually needs from what they say they want, agree what to deliver, then build it, deploy it and support it in use. Usually I was the only engineer, working with designers and whoever the client had in house.',
            'The client relationship was mine as much as the code: scoping the work, and taking the call when something broke.',
          ],
          loop: {
            label: '↻ THE LOOP',
            steps: ['Consult', 'Scope', 'Design', 'Build', 'Deploy', 'Support'],
          },
        },
      },
    ],
  },
  {
    id: 'education',
    pillLabel: 'Education',
    prompt: "Where'd he study?",
    blocks: [
      {
        type: 'education',
        payload: {
          badge: 'EDUCATION',
          title: 'Education',
          subtitle: 'DEGREES & STUDY',
          items: [
            {
              img: 'uploads/hanze.webp',
              url: 'https://www.hanze.nl/en/',
              degree: 'Hanze University of Applied Sciences',
              school: 'Computer Science',
              year: '2011–2016',
            },
            {
              initials: 'ROC',
              degree: 'ROC (Vocational)',
              school: 'Computer and Network Systems, CCNA',
              year: '2005–2009',
            },
          ],
        },
      },

      {
        type: 'note',
        payload: {
          eyebrow: 'PHILOSOPHY',
          title: 'Still curious',
          paragraphs: [
            "I taught myself to code around 10, for the simple reason that I liked doing it. Decades later, things haven't changed: I love building things people are happy to use, and I love working out how to get there.",
          ],
        },
      },
    ],
  },
];
