export interface DemoJobCard {
  id: string;
  title: string;
  location: string;
  description: string;
  jobType: string;
  image: string;
  appliedDuration?: string;
}

export const APPLIED_JOBS: DemoJobCard[] = [
  {
    id: "1",
    title: "Digital Marketing Specialist",
    location: "New York, USA",
    description:
      "We are looking for a creative Digital Marketing Specialist to plan and manage marketing campaigns that promote our brand and services.",
    jobType: "Full Time",
    image: "/assets/Images/digital-marketing.png",
    appliedDuration: "Applied 2 days ago",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    location: "San Francisco, USA",
    description:
      "Join our product team to design intuitive user experiences across web and mobile platforms for our growing job portal audience.",
    jobType: "Remote",
    image: "/assets/Images/ui-ux.png",
    appliedDuration: "Applied 5 days ago",
  },
  {
    id: "3",
    title: "Web Designer",
    location: "Chicago, USA",
    description:
      "Responsible for creating responsive website layouts, collaborating with developers, and maintaining consistent brand visuals.",
    jobType: "Part Time",
    image: "/assets/Images/web-designer.png",
    appliedDuration: "Applied 1 week ago",
  },
];

export const SAVED_JOBS: DemoJobCard[] = [
  {
    id: "1",
    title: "Product Designer",
    location: "Austin, USA",
    description:
      "Help shape product direction and deliver polished design systems for a fast-growing SaaS company focused on hiring solutions.",
    jobType: "Full Time",
    image: "/assets/Images/produc-designer.png",
  },
  {
    id: "2",
    title: "Frontend Developer",
    location: "Seattle, USA",
    description:
      "Build modern interfaces with React and Next.js while working closely with designers to ship accessible, performant user experiences.",
    jobType: "Hybrid",
    image: "/assets/Images/digital-marketing.png",
  },
  {
    id: "3",
    title: "Content Strategist",
    location: "Boston, USA",
    description:
      "Develop content plans, write compelling copy, and optimize campaigns that help employers attract qualified candidates.",
    jobType: "Contract",
    image: "/assets/Images/ui-ux.png",
  },
];
