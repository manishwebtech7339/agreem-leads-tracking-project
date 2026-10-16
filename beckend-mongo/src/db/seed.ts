import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./index.js";
import { User, Lead, Note } from "./schema.js";
import { hashPassword } from "../lib/securePassword.js";

const DEFAULT_PASSWORD = "12345678";

const seedUsers = [
  {
    name: "Manish Panchal",
    email: "manish@yopmail.com",
    gender: "male",
    password: DEFAULT_PASSWORD,
  },
  {
    name: "Admin User",
    email: "admin@agreem.com",
    gender: "male",
    password: DEFAULT_PASSWORD,
  },
  {
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    gender: "female",
    password: DEFAULT_PASSWORD,
  },
  {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    gender: "female",
    password: DEFAULT_PASSWORD,
  },
];

const seedLeadsData = [
  {
    name: "TechVision Dynamics",
    email: "contact@techvision.com",
    phone: "+1-415-555-0142",
    status: "new" as const,
    assignedUserIndex: 0,
    notes: [
      "Inquired through website form about CRM integrations.",
      "Sent introductory brochure and scheduling link for discovery call.",
    ],
  },
  {
    name: "Acme Industrial Corp",
    email: "info@acmeindustrial.com",
    phone: "+1-312-555-0188",
    status: "contacted" as const,
    assignedUserIndex: 0,
    notes: [
      "Spoke with procurement team regarding annual licensing.",
      "Follow-up scheduled for next Thursday to present proposal.",
    ],
  },
  {
    name: "Apex Global Systems",
    email: "sales@apexglobal.com",
    phone: "+1-212-555-0199",
    status: "qualified" as const,
    assignedUserIndex: 1,
    notes: [
      "Completed security questionnaire and technical compliance audit.",
      "Contract submitted to CFO for final sign-off.",
    ],
  },
  {
    name: "BlueStone Enterprises",
    email: "hello@bluestone.io",
    phone: "+1-206-555-0123",
    status: "new" as const,
    assignedUserIndex: 1,
    notes: ["Requested demo for sales operations leadership."],
  },
  {
    name: "CyberCore Security",
    email: "security@cybercore.net",
    phone: "+1-650-555-0177",
    status: "qualified" as const,
    assignedUserIndex: 2,
    notes: [
      "Reviewed RBAC and audit logging requirements.",
      "Pricing finalized for 100 enterprise user tier.",
    ],
  },
  {
    name: "Delta Logic Inc",
    email: "support@deltalogic.com",
    phone: "+1-512-555-0134",
    status: "contacted" as const,
    assignedUserIndex: 2,
    notes: [
      "Discovery call conducted with Head of Operations.",
      "Pending trial account setup and configuration.",
    ],
  },
  {
    name: "Echo Stream Media",
    email: "partners@echostream.com",
    phone: "+1-303-555-0165",
    status: "lost" as const,
    assignedUserIndex: 3,
    notes: [
      "Budget reallocated to internal tooling for Q4.",
      "Advised to follow up in 6 months for review.",
    ],
  },
  {
    name: "Falcon Logistics",
    email: "dispatch@falconlogistics.com",
    phone: "+1-404-555-0111",
    status: "contacted" as const,
    assignedUserIndex: 3,
    notes: ["Product demonstration completed with regional directors."],
  },
  {
    name: "Genesis Health Tech",
    email: "info@genesishealth.org",
    phone: "+1-617-555-0145",
    status: "qualified" as const,
    assignedUserIndex: 0,
    notes: [
      "HIPAA compliance requirements verified with legal team.",
      "Drafting master services agreement.",
    ],
  },
  {
    name: "Horizon Cloud Services",
    email: "cloud@horizoninfra.com",
    phone: "+1-919-555-0129",
    status: "new" as const,
    assignedUserIndex: 1,
    notes: ["Lead generated from Tech Summit booth inquiry."],
  },
  {
    name: "Infinity Retail Group",
    email: "procurement@infinityretail.com",
    phone: "+1-702-555-0156",
    status: "lost" as const,
    assignedUserIndex: 2,
    notes: ["Selected incumbent vendor renewal instead."],
  },
  {
    name: "Jupiter Financial Labs",
    email: "invest@jupiterlabs.com",
    phone: "+1-305-555-0182",
    status: "qualified" as const,
    assignedUserIndex: 0,
    notes: [
      "Enterprise SLA terms agreed upon.",
      "Final contract under executive review.",
    ],
  },
  {
    name: "Krypton Energy Solutions",
    email: "energy@kryptoncorp.com",
    phone: "+1-713-555-0190",
    status: "new" as const,
    assignedUserIndex: 3,
    notes: ["Inbound lead interested in tracking distributed field agents."],
  },
  {
    name: "Lunar Robotics",
    email: "leads@lunar-robotics.ai",
    phone: "+1-425-555-0174",
    status: "contacted" as const,
    assignedUserIndex: 1,
    notes: ["Technical deep dive completed with AI engineering team."],
  },
  {
    name: "Matrix Software Guild",
    email: "team@matrixguild.dev",
    phone: "+1-619-555-0138",
    status: "qualified" as const,
    assignedUserIndex: 2,
    notes: [
      "Validated webhook and API payload specifications.",
      "POC marked as successful by lead architect.",
    ],
  },
  {
    name: "Nexus BioTech",
    email: "research@nexusbio.com",
    phone: "+1-215-555-0163",
    status: "lost" as const,
    assignedUserIndex: 3,
    notes: ["Project cancelled due to company restructuring."],
  },
  {
    name: "Omega Telecom",
    email: "enterprise@omegatelecom.net",
    phone: "+1-813-555-0149",
    status: "new" as const,
    assignedUserIndex: 0,
    notes: ["Requested consultation for contact center automation."],
  },
  {
    name: "Pulse Interactive",
    email: "hello@pulseinteractive.io",
    phone: "+1-503-555-0128",
    status: "contacted" as const,
    assignedUserIndex: 1,
    notes: ["Introductory call scheduled for coming Tuesday at 2 PM PST."],
  },
];

async function seed() {
  const shouldClean = !process.argv.includes("--no-clean");

  console.log("   Agreem Leads Seeder (MongoDB)          ");

  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Cleaning existing records...");
    await Note.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
    console.log("  ✓ Cleared notes, leads, and users.");

    console.log("Seeding users...");
    const createdUsers: any[] = [];

    for (const userData of seedUsers) {
      const { password: hashedPassword, salt } = await hashPassword(
        userData.password,
      );

      const createdUser = await User.create({
        name: userData.name,
        email: userData.email,
        gender: userData.gender,
        password: hashedPassword,
        salt: salt,
      });

      createdUsers.push(createdUser);
      console.log(
        `  ✓ Created user: ${createdUser.name} (${createdUser.email})`,
      );
    }

    console.log(`Seeding ${seedLeadsData.length} leads...`);
    const createdLeads: any[] = [];

    for (const leadData of seedLeadsData) {
      const assignedUser =
        createdUsers[leadData.assignedUserIndex % createdUsers.length];

      const createdLead = await Lead.create({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        status: leadData.status,
        userId: assignedUser._id,
      });

      createdLeads.push({
        lead: createdLead,
        rawNotes: leadData.notes,
        userId: assignedUser._id,
      });
    }
    console.log(`  ✓ Inserted ${createdLeads.length} leads successfully.`);

    console.log("Seeding notes for leads...");
    let notesCount = 0;

    for (const item of createdLeads) {
      for (const noteContent of item.rawNotes) {
        await Note.create({
          content: noteContent,
          leadId: item.lead._id,
          userId: item.userId,
        });
        notesCount++;
      }
    }
    console.log(`  ✓ Inserted ${notesCount} notes successfully.`);

    console.log("Seeding Completed Successfully!  ");
    console.log(`Users:  ${createdUsers.length}`);
    console.log(`Leads:  ${createdLeads.length}`);
    console.log(`Notes:  ${notesCount}`);
    console.log("------------------------------------------");
    console.log("Sample Login Credentials:");
    for (const u of seedUsers) {
      console.log(
        `  • Email: admin@agreem.com | Password: ${DEFAULT_PASSWORD}`,
      );
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
}

seed();
