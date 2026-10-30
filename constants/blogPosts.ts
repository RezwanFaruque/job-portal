export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  excerpt: string;
  introduction: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "write-a-resume-that-gets-noticed",
    title: "How to Write a Resume That Gets Noticed",
    category: "Career Advice",
    publishedAt: "2024-09-18",
    readTime: "6 min read",
    image: "/assets/Images/creer-dev-one.png",
    excerpt:
      "A clear, focused resume helps hiring teams quickly understand the experience and strengths you bring to a role.",
    introduction:
      "A strong resume is more than a record of past jobs. It is a concise introduction to the value you can bring to your next team. A few deliberate choices can make your experience easier to understand and remember.",
    sections: [
      {
        heading: "Start with the role you want",
        paragraphs: [
          "Read the job description carefully and note the responsibilities, skills, and language that appear repeatedly. Use those details to decide which parts of your experience deserve the most attention.",
          "Keep your claims accurate. Tailoring a resume means highlighting relevant work, not adding skills or results you cannot support.",
        ],
      },
      {
        heading: "Make achievements easy to scan",
        paragraphs: [
          "Use short bullet points that begin with an action and explain the result. Add numbers when they give useful context, such as the size of a project, the time saved, or the people supported.",
          "A consistent layout, readable type, and clear section headings help recruiters find the information they need without searching.",
        ],
      },
      {
        heading: "Review before you send",
        paragraphs: [
          "Check dates, spelling, links, and contact details. Save a clean PDF copy unless the application asks for another format, and use a descriptive file name.",
        ],
      },
    ],
  },
  {
    slug: "prepare-for-a-confident-interview",
    title: "A Practical Guide to Interview Preparation",
    category: "Interview Tips",
    publishedAt: "2024-09-10",
    readTime: "5 min read",
    image: "/assets/Images/creer-dev-three.png",
    excerpt:
      "Prepare thoughtful examples, useful questions, and a calm plan for the day of your next interview.",
    introduction:
      "Interview preparation is not about memorizing perfect answers. It is about understanding the role, reflecting on your experience, and making it easy to have a genuine conversation with the hiring team.",
    sections: [
      {
        heading: "Understand the role and organization",
        paragraphs: [
          "Review the job description and the organization’s public information. Identify the main challenges the position may address and connect them to examples from your own work.",
          "Prepare a brief explanation of why the role interests you. Specific, honest reasons are more memorable than a generic script.",
        ],
      },
      {
        heading: "Choose examples that show your approach",
        paragraphs: [
          "Think of a few situations that demonstrate how you solve problems, collaborate, adapt, or learn. Explain the context, the actions you took, and what happened as a result.",
          "If an outcome was difficult, describe what you learned and what you would do differently. Reflection can be just as useful as a perfect result.",
        ],
      },
      {
        heading: "Make space for your questions",
        paragraphs: [
          "Ask about the team’s priorities, how success is measured, and what the next steps look like. These questions help you decide whether the opportunity fits your goals too.",
        ],
      },
    ],
  },
  {
    slug: "build-skills-for-a-changing-workplace",
    title: "Building Skills for a Changing Workplace",
    category: "Professional Growth",
    publishedAt: "2024-08-27",
    readTime: "7 min read",
    image: "/assets/Images/creer-dev-two.png",
    excerpt:
      "A practical approach to choosing what to learn and turning new knowledge into everyday work.",
    introduction:
      "Roles and tools evolve, but career development does not need to feel overwhelming. A steady learning habit can help you stay curious, build confidence, and prepare for new responsibilities.",
    sections: [
      {
        heading: "Choose one useful learning goal",
        paragraphs: [
          "Start with a skill connected to work you want to do next. Ask a manager, mentor, or colleague which capabilities would make the biggest difference in your current role or a future one.",
          "Break the goal into a small weekly commitment. A focused hour of practice is easier to sustain than an ambitious plan with no time on the calendar.",
        ],
      },
      {
        heading: "Practice on real work",
        paragraphs: [
          "Look for a low-risk project where you can apply what you are learning. Practice builds stronger understanding than passive reading alone, and a real example gives you something concrete to discuss.",
        ],
      },
      {
        heading: "Keep track of progress",
        paragraphs: [
          "Write down what you tried, what improved, and what you still want to understand. Revisit your notes each month and adjust the goal as your responsibilities change.",
        ],
      },
    ],
  },
  {
    slug: "make-your-job-search-more-focused",
    title: "Make Your Job Search More Focused",
    category: "Job Search",
    publishedAt: "2024-08-14",
    readTime: "4 min read",
    image: "/assets/Images/web-designer.png",
    excerpt:
      "Create a simple routine for finding relevant openings, tracking applications, and following up.",
    introduction:
      "A thoughtful job search is easier to manage when it has a routine. Instead of applying everywhere, use a few clear priorities to focus your time on roles that match your skills and direction.",
    sections: [
      {
        heading: "Set your search criteria",
        paragraphs: [
          "Decide which role types, locations, work arrangements, and industries are most important to you. Some criteria can be flexible, but knowing your priorities makes it easier to evaluate an opening.",
        ],
      },
      {
        heading: "Keep a lightweight application tracker",
        paragraphs: [
          "Record the role, organization, application date, and next step. A simple list prevents missed follow-ups and helps you notice which versions of your resume are getting responses.",
        ],
      },
      {
        heading: "Make time for follow-through",
        paragraphs: [
          "Set aside a regular block to review new openings and check active applications. Follow the employer’s instructions on timing, and keep messages brief, courteous, and specific.",
        ],
      },
    ],
  },
];
