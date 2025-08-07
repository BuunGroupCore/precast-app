/**
 * Testimonial data structure for hero stories
 */
export interface Testimonial {
  /** Unique identifier */
  id: string;
  /** Developer's name */
  name: string;
  /** Professional role/title */
  role: string;
  /** Company or organization name */
  company: string;
  /** DiceBear avatar seed for consistent avatar generation */
  avatarSeed: string;
  /** Testimonial content/story */
  content: string;
  /** Rating out of 5 stars */
  rating: number;
  /** Submission date in YYYY-MM-DD format */
  date: string;
  /** Type of project built with PRECAST */
  projectType?: string;
  /** Whether to highlight this testimonial with special styling */
  highlighted?: boolean;
  /** Legacy field - replaced by automatic first hero detection */
  isFirstHero?: boolean;
}

export const testimonials: Testimonial[] = [];
