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
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/',
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
    pillLabel: 'Profile',
    prompt: 'Who is Matthijn, in a nutshell?',
    blocks: [
      {
        type: 'profile',
        payload: {
          initials: 'MD',
          name: 'M. Dijkstra',
          label: 'STAFF ENGINEER',
          bio: "I'm a Software architect and engineer who owns the shape of a system, not just my corner of it. I've built platforms from the first line of code to production at scale, most recently as PeerWell's first full-time engineer, where I designed and built most of a digital therapeutics platform and grew with it through funding rounds and an acquisition, taking on more of the architecture as the team scaled across the US and Europe.",
          badge: 'AVAILABLE FOR WORK',
          availability: 'Available for Staff/founding roles · Remote (EU/US overlap)',
          cta: 'Hire me →',
          note: 'usually replies same day',
          noteHover: '1 of 1 available',
          email: 'hire@mdijkstra.dev',
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
              text: 'Joined PeerWell in 2016 as the first full-time engineer, build a digital therapeutics platform for surgical preparation and recovery. Healthcare software carries high bar. Patients rely on it for post-surgical guidance and clinicians build it into care pathways.',
            },
            {
              text: "Designed and built most of the initial platform, including the architecture the patent describes: the recommendation engine, the configurable scoring, and the patient data model behind it. As the team grew across the US and Europe, I took on more of the system's design and worked with the other engineers as it scaled. Also involved with the interview and vetting process for hiring engineers for a team that was remote almost from the start.",
            },
            {
              text: 'Build the early machine learning work on the product, mainly the image and pose recognition system behind the AI movement assisted features. Building a platform that allowed new exercises to be created from sample videos.',
            },
            {
              pre: 'Co-inventor on published U.S. Patent Application ',
              linkText: 'US20180286509A1',
              url: 'https://patents.google.com/patent/US20180286509A1/en',
              post: ', an adaptive recommendation engine that combines patient context, historical outcomes, and configurable scoring to personalize surgical prep and recovery pathways.',
            },
            {
              text: 'Stayed as first engineer through multiple funding rounds and the 2022 acquisition by Bardavon Health Innovations.',
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
          tech: ['TypeScript', 'React', 'Node', 'iOS', 'Computer Vision', 'DocumentDB'],
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
              text: "When Bardavon acquired PeerWell in 2022, I stayed on to lead the integration. The platform moved onto Bardavon's infrastructure and its focus shifted from surgical patients to injured workers, launching in April 2024 as Recovery+, which connects people recovering from workplace injuries with licensed clinical coaches. My work spanned across the codebase, systems, and the team: merging engineering practices across two companies, documenting the architecture, and guiding Bardavon's engineers as they took ownership.",
            },
            {
              text: "The premise that made PeerWell worth acquiring carried straight into its new use: give people recovering from injury the right information and guidance, and they get better faster at lower cost. Adapting the platform to deliver that for workers' compensation was the core of the work. That work wrapped in 2025. The measure of a good handover is that you can leave, and by then I could.",
            },
          ],
          tech: ['AWS Fargate', 'Terraform', 'Docker', 'GitHub Actions', 'CI/CD'],
          cta: 'View Recovery+ →',
          ctaNote: '@ bardavon.com',
          href: 'https://www.bardavon.com/injury-recovery/recovery-plus/',
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
              name: 'Manish Sha',
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
    id: 'approach',
    pillLabel: 'Approach',
    prompt: 'How does he approach the work?',
    blocks: [
      {
        type: 'approach',
        payload: {
          badge: 'APPROACH',
          title: 'How I build',
          intro:
            "Tools change constantly. The convictions underneath don't. These are the ones that survived twenty years of the field reinventing itself.",
          items: [
            {
              idx: '01',
              lead: 'Quality is enforced by the system, not by discipline.',
              body: "Hard gates in the pipeline: coverage, linting, security. Rules that depend on people remembering them erode, so the pipeline doesn't negotiate, and code review doesn't have to be the last line of defense.",
            },
            {
              idx: '02',
              lead: 'Architecture follows the problem.',
              body: "Team shape, failure domains, and what genuinely needs to scale on its own decide the design, not what's currently fashionable. Systems built that way are the ones still standing years later.",
            },
            {
              idx: '03',
              lead: 'Everything reproducible.',
              body: "Infrastructure as code, environments rebuilt from a repo, nothing that lives only in someone's head or on someone's laptop. If it can't be recreated, it's a liability.",
            },
            {
              idx: '04',
              lead: 'Built for the case where being wrong hurts someone.',
              body: "Healthcare set the bar: patients acted on what the platform told them. That standard, data you can trust and failures thought through in advance, doesn't switch off in other domains.",
            },
            {
              idx: '05',
              lead: "The work is shifting from writing code to specifying it, and I'm shifting with it.",
              body: "Agentic tools do more of the typing while I write the spec and review the output hard. It's the same skill as extracting requirements from stakeholders, pointed the other way. The leverage is enormous, and it's only worth as much as the review standards behind it.",
            },
          ],
        },
      },
    ],
  },
  {
    id: 'history',
    prompt: 'Where did he start out?',
    blocks: [
      {
        type: 'note',
        payload: {
          badge: 'FREELANCE',
          eyebrow: 'INDEPENDENT · 2007–2016',
          title: 'Freelance',
          paragraphs: [
            "I spent close to nine years freelancing, alongside studying and later full-time work. Freelancing is mostly the same loop repeated across very different clients: work out what someone actually needs from what they say they want, agree on what you'll deliver, then build, ship and support it. Usually as the sole engineer, often alongside designers and the client's own people.",
            "The work ran the full range. At one end, WordPress and marketing sites for local businesses. At the other, systems with real weight: an online restaurant ordering and payments platform with orders printing straight to the counter, and early 360° video for Mini's 50th anniversary that let people sit in the cars and walk through a museum.",
            'Across all of it I owned the whole chain: the technical work and the client relationship.',
          ],
          loop: {
            label: '↻ THE LOOP',
            steps: ['Consult', 'Scope', 'Design', 'Build', 'Deploy', 'Support'],
          },
        },
      },

      {
        type: 'experience',
        payload: {
          badge: 'FREELANCE · PROJECT',
          video: 'https://player.vimeo.com/video/178323880?h=ad16d3f9a9',
          name: 'The MINI Museum',
          meta: '2014 · FREELANCE @ YELLOWBIRD',
          blurb:
            "A pioneering 3D interactive video experience built for MINI's 50th birthday. Sit inside the cars and walk around the museum, all virtually.",
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
              img: 'https://api.mdijkstra.dev/public/images/hanze.webp',
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
            "I taught myself to code years before it occurred to me it could be a job. Twenty-five years later the instinct hasn't changed: I want to know how the thing actually works.\n" +
              '\n' +
              "That's never stopped at my own layer. Following something end to end is what lets you tell the difference between a feature that ships and a product people actually come back to.",
          ],
        },
      },
    ],
  },
];
