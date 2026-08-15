import type { PriorityLevel } from "../components/PriorityBadge";

export type { PriorityLevel };

export interface TicketComment {
  id: string;
  author: string;
  text: string;
}

export interface TicketSource {
  name: string;
  channel: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  assignee?: string;
  source: TicketSource;
  comments: TicketComment[];
}

export interface TicketColumn {
  id: string;
  title: string;
}

export const TICKET_COLUMNS: TicketColumn[] = [
  { id: "todo", title: "To-do" },
  { id: "in-progress", title: "In-progress" },
  { id: "waiting", title: "Waiting on customer" },
  { id: "resolved", title: "Resolved" },
];

export const INITIAL_TICKETS: Record<string, Ticket[]> = {
  todo: [
    {
      id: "ticket-1",
      ticketNumber: "086qe7",
      title: "Incorrect AI Response Generation",
      description:
        "User is receiving irrelevant or inaccurate responses from the chatbot during support conversations.",
      priority: "low",
      assignee: "Prakash Shrestha",
      source: { name: "Prakash Shrestha", channel: "Instagram" },
      comments: [
        {
          id: "comment-1",
          author: "Prakash Shrestha",
          text: "Mula k ho esto, fix gareko theyo maile!",
        },
        {
          id: "comment-2",
          author: "Apsan Rana Magar",
          text: "Kta ho PUBG Handum",
        },
      ],
    },
    {
      id: "ticket-2",
      ticketNumber: "091pl3",
      title: "Make the user buy the templete",
      description:
        "Discuss feature and push him into buying the premium template package.",
      priority: "medium",
      assignee: "Sam Doe",
      source: { name: "Sam Doe", channel: "Website" },
      comments: [],
    },
    {
      id: "ticket-3",
      ticketNumber: "104wk9",
      title: "Push the product1",
      description: "Discuss feature and push him into buying the product.",
      priority: "high",
      assignee: "Kiran Rai",
      source: { name: "Kiran Rai", channel: "WhatsApp" },
      comments: [],
    },
  ],
  "in-progress": [
    {
      id: "ticket-4",
      ticketNumber: "112zx4",
      title: "Push the product1",
      description: "Discuss feature and push him into buying the product.",
      priority: "medium",
      assignee: "Sam Doe",
      source: { name: "Sam Doe", channel: "Instagram" },
      comments: [],
    },
    {
      id: "ticket-7",
      ticketNumber: "118bn2",
      title: "Make the user buy the templete",
      description:
        "Discuss feature and push him into buying the premium template package.",
      priority: "low",
      assignee: "Prakash Shrestha",
      source: { name: "Prakash Shrestha", channel: "Website" },
      comments: [],
    },
  ],
  waiting: [
    {
      id: "ticket-6",
      ticketNumber: "121cm8",
      title: "Make the user buy the templete",
      description:
        "Discuss feature and push him into buying the premium template package.",
      priority: "low",
      source: { name: "Unassigned", channel: "Instagram" },
      comments: [],
    },
  ],
  resolved: [
    {
      id: "ticket-5",
      ticketNumber: "099hf1",
      title: "Make the user buy the templete",
      description:
        "Discuss feature and push him into buying the premium template package.",
      priority: "medium",
      assignee: "Prakash Shrestha",
      source: { name: "Prakash Shrestha", channel: "Instagram" },
      comments: [],
    },
  ],
};
