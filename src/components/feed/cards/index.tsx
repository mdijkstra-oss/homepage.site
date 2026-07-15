import type { CardBlock } from '../../../data/blocks';
import { assertNever } from '../../../lib/assertNever';
import { AlsoCard } from './AlsoCard';
import { ApproachCard } from './ApproachCard';
import { EducationCard } from './EducationCard';
import { ExperienceCard } from './ExperienceCard';
import { NoteCard } from './NoteCard';
import { ProfileCard } from './ProfileCard';
import { ReviewsCard } from './ReviewsCard';
import { RoleCard } from './RoleCard';

export function Block({ block }: { block: CardBlock }) {
  switch (block.type) {
    case 'profile':
      return <ProfileCard payload={block.payload} />;
    case 'role':
      return <RoleCard payload={block.payload} />;
    case 'reviews':
      return <ReviewsCard payload={block.payload} />;
    case 'approach':
      return <ApproachCard payload={block.payload} />;
    case 'note':
      return <NoteCard payload={block.payload} />;
    case 'education':
      return <EducationCard payload={block.payload} />;
    case 'experience':
      return <ExperienceCard payload={block.payload} />;
    case 'also':
      return <AlsoCard payload={block.payload} />;
    default:
      return assertNever(block);
  }
}
