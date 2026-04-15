import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Hero } from "../models/Hero.js";
import { About } from "../models/About.js";
import { Project } from "../models/Project.js";
import { Post } from "../models/Post.js";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const adminEmail = (process.env.ADMIN_EMAIL || "admin@emmanuelocheme.com").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "QuantroAdmin2025!";

async function seed(): Promise<void> {
  await connectDb(mongoUri);

  await Hero.findOneAndUpdate(
    {},
    {
      headline: "Building Technology That Creates Opportunities",
      subheadline:
        "I'm Emmanuel Ocheme — Founder of Quantro Software Labs, passionate about AI, Web3, and SaaS solutions for students & young Africans.",
      primaryCtaText: "Explore Projects →",
      primaryCtaLink: "/projects",
      secondaryCtaText: "Follow My Journey →",
      secondaryCtaLink: "/blog",
      heroImage:
        "https://placehold.co/600x800/0B0B0B/D4AF37?text=Emmanuel+Ocheme",
    },
    { upsert: true, new: true }
  );

  await About.findOneAndUpdate(
    {},
    {
      biography: `<p>I've always believed technology can create real opportunities. My journey began with a curiosity for how systems work and evolved into a mission to build solutions that empower others.</p><p>As the founder of Quantro Software Labs, I lead a team focused on creating AI-powered tools, Web3 infrastructure, and SaaS platforms designed specifically for students and young Africans. We're not just building software — we're building pathways to economic freedom.</p><p>My approach combines technical expertise with a deep understanding of the challenges facing young people in Africa. Every project I undertake is driven by one question: "How does this create opportunity?"</p><p>When I'm not coding or leading Quantro, I'm mentoring emerging developers, speaking at tech events, and exploring the frontiers of artificial intelligence and blockchain technology.</p><p>I design, build, and scale tech solutions that solve real problems. With a focus on AI, Web3, and SaaS products, my mission is to empower the next generation of African innovators. Quantro Software Labs represents my commitment to creating technology that transforms opportunities into reality.</p>`,
      achievements: [
        "Founded Quantro Software Labs (2024)",
        "Built and deployed 5+ production applications",
        "Mentored 50+ aspiring developers",
        "Speaker at leading tech events",
      ],
      skills: [
        "AI & Machine Learning",
        "Web3 / Blockchain",
        "Full-Stack Development",
        "SaaS Architecture",
        "Product Strategy",
        "Technical Leadership",
        "React/Node.js",
        "MongoDB/Supabase",
        "Smart Contracts",
      ],
      mission:
        "To build technology that creates tangible opportunities for students and young Africans.",
      vision:
        "A future where every young African has access to tools and platforms that enable economic independence.",
    },
    { upsert: true, new: true }
  );

  const projects = [
    {
      title: "Quantro Software Labs",
      slug: "quantro-software-labs",
      shortDescription:
        "AI & Web3-powered SaaS solutions designed specifically for students and young Africans.",
      fullDescription: `<p>Quantro Software Labs is my flagship venture — a technology studio focused on building products that matter. We specialize in:</p><ul><li>AI-powered educational tools that adapt to individual learning styles</li><li>Web3 platforms that democratize access to financial tools</li><li>SaaS solutions that streamline entrepreneurship for young founders</li></ul><p>Our current projects include an AI tutoring assistant, a decentralized savings platform, and a suite of productivity tools for students.</p>`,
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Web3.js",
        "Solidity",
        "Python",
        "TensorFlow",
      ],
      image: "https://placehold.co/600x400/111111/D4AF37?text=Quantro+Labs",
      ctaLink: "/projects/quantro-software-labs",
      featured: true,
      order: 0,
    },
    {
      title: "AI Study Assistant",
      slug: "ai-study-assistant",
      shortDescription:
        "An intelligent tutoring system that adapts to each student's learning pace and style.",
      fullDescription: `<p>Project Alpha focuses on personalized learning through AI.</p>`,
      technologies: ["Python", "TensorFlow", "React", "FastAPI"],
      image: "https://placehold.co/600x400/111111/00F3FF?text=AI+Study",
      ctaLink: "/projects",
      featured: false,
      order: 1,
      status: "In Development",
    },
    {
      title: "Web3 Savings Circle",
      slug: "web3-savings-circle",
      shortDescription:
        "Decentralized savings platform enabling communities to pool resources securely.",
      fullDescription: `<p>Project Beta explores community savings on-chain.</p>`,
      technologies: ["Solidity", "Web3.js", "Ethereum", "Next.js"],
      image: "https://placehold.co/600x400/111111/D4AF37?text=Web3+Savings",
      ctaLink: "/projects",
      featured: false,
      order: 2,
      status: "Prototype Stage",
    },
    {
      title: "SaaS Starter Kit",
      slug: "saas-starter-kit",
      shortDescription:
        "Open-source boilerplate for African developers launching SaaS products.",
      fullDescription: `<p>Project Gamma is an open-source starter for founders.</p>`,
      technologies: ["Next.js", "Tailwind", "Stripe", "MongoDB"],
      image: "https://placehold.co/600x400/111111/00F3FF?text=SaaS+Kit",
      ctaLink: "/projects",
      featured: false,
      order: 3,
      status: "Open Source",
    },
  ];

  for (const p of projects) {
    await Project.findOneAndUpdate(
      { slug: p.slug },
      {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        technologies: p.technologies,
        image: p.image,
        ctaLink: p.ctaLink,
        featured: p.featured,
        order: p.order,
        status: p.status,
      },
      { upsert: true, new: true }
    );
  }

  const posts = [
    {
      title: "Web3 Explained for African Students: Why It Matters",
      slug: "web3-explained-african-students",
      excerpt:
        "Understanding blockchain technology and its potential to transform financial access across Africa.",
      content: `<p>Web3 isn't just a buzzword — it's a paradigm shift in how we think about ownership, identity, and value exchange. For African students, this technology represents unprecedented opportunities...</p>`,
      author: "Emmanuel Ocheme",
      date: new Date("2025-03-15"),
      image: "https://placehold.co/800x400/111111/D4AF37?text=Web3+Africa",
      readTime: 5,
      published: true,
    },
    {
      title: "How to Build a SaaS Product from Scratch: A Practical Guide",
      slug: "build-saas-product-from-scratch",
      excerpt:
        "A step-by-step guide for aspiring founders looking to launch their first software product.",
      content: `<p>Building a SaaS product requires more than just technical skills. In this guide, I share the framework I use when launching new products...</p>`,
      author: "Emmanuel Ocheme",
      date: new Date("2025-03-01"),
      image: "https://placehold.co/800x400/111111/00F3FF?text=SaaS+Guide",
      readTime: 8,
      published: true,
    },
    {
      title: "AI for Practical Solutions in Africa: Beyond the Hype",
      slug: "ai-practical-solutions-africa",
      excerpt:
        "How artificial intelligence can address real challenges facing African communities.",
      content: `<p>AI has the potential to revolutionize sectors from agriculture to education across Africa. But we must focus on practical applications...</p>`,
      author: "Emmanuel Ocheme",
      date: new Date("2025-02-20"),
      image: "https://placehold.co/800x400/111111/D4AF37?text=AI+Africa",
      readTime: 6,
      published: true,
    },
  ];

  for (const post of posts) {
    await Post.findOneAndUpdate({ slug: post.slug }, post, { upsert: true, new: true });
  }

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      email: adminEmail,
      password: hash,
      role: "admin",
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }

  console.log("Seed completed.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
