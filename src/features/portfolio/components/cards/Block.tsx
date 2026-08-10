import { memo } from 'react';
import { assertNever } from '../../../../lib/assertNever';
import type { CardBlock } from '../../model/types';
import { AlsoCard } from './AlsoCard/AlsoCard';
import { ApproachCard } from './ApproachCard/ApproachCard';
import { EducationCard } from './EducationCard/EducationCard';
import { ExperienceCard } from './ExperienceCard/ExperienceCard';
import { NoteCard } from './NoteCard/NoteCard';
import { ProfileCard } from './ProfileCard/ProfileCard';
import { ReviewsCard } from './ReviewsCard/ReviewsCard';
import { RoleCard } from './RoleCard/RoleCard';

// Memoized: blocks come from static content, so chat re-renders skip the card tree.
export const Block = memo(function Block({ block }: { block: CardBlock }) {
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
});
