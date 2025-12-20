
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Instagram, Youtube } from 'lucide-react';

// This interface defines what info a team member can have
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;  // Optional: Paste LinkedIn URL
  instagram?: string; 
  instagram2?: string;// Optional: Paste Instagram URL
  youtube?: string; 
  substack?: string;
  tiktok?: string;
  facebook?: string;
  website?: string // Optional: Paste YouTube URL
  email?: string;     // Optional: Paste Email Address
}

// --- HOW TO ADD NEW PEOPLE ---
// 1. Add a new object to this list below.
// 2. Ensure the image file exists in your "public/assets/team/" folder.
// 3. To add LINE BREAKS in the bio:
//    - Use `\n\n` inside the text for a new paragraph.
//    - OR change the double quotes " to backticks ` and just press Enter.
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ricquel Harper",
    role: "Director of Education, Ethics & Governance",
    bio: "As the Director of Education, Ethics and Governance, Ricquel helps guide the ethical frameworks and policy strategies that shape our global work. The focus is on responsible AI development, expanding representation across the AI lifecycle, and ensuring underrepresented communities remain centered. Working collaboratively with partners and contributors, the team supports ethical governance across international initiatives and advances standards for ethical, accountable AI.",
    image: "/assets/team/headshot_ricquel.jpeg",
    linkedin: "https://www.linkedin.com/in/ricquelharper/",  // PASTE LINK HERE
    instagram: "", // PASTE LINK HERE
    youtube: "",   // PASTE LINK HERE
    email: "ricquel@sheisai.ai"      // PASTE EMAIL HERE
  },
  {
    name: "Amanda Jeffs",
    role: "Founder | CEO, Operations and Marketing",
    bio: "As Founder and CEO of SHE IS AI and creator of the AI Advisory Council, Amanda leads with a deep commitment to human-led, ethical, and inclusive AI. Her work centers on ensuring that no voice is left behind as AI reshapes economies, cultures, and opportunity worldwide. With a background in marketing, business, community, coaching, and mentoring university students, she brings together a global collective of experts to guide responsible AI adoption, amplify diverse perspectives, and translate ethics into practical strategy. Through the SHE IS AI community and ecosystem, Amanda supports individuals and organisations to navigate the AI landscape safely, ethically, and with clarity, bridging innovation, integrity, and real-world impact.",
    image: "/assets/team/headshot_amanda.jpg",
    linkedin: "https://www.linkedin.com/in/amandajeffs",
    instagram: "https://www.instagram.com/amandajeffsnz",
    youtube: "",
    substack: "https://amandajeffsnz.substack.com/",
    email: "amanda@sheisai.ai"
  },
  {
    name: "El Wong",
    role: "Regional Lead Canada",
    bio: "Advisory Council Member & Regional Lead, Canada. Ethics committee member. She is an AI Educator, Trainer and Business coach with a mission to reach 1 million women and people from underrepresented communities. Her background of coporate training, project and change management and community development intersecting with her passion for AI contributes to her human centric faciitation approach to ensure no one is left behind in the Age of AI.",
    image: "/assets/team/headshot_el.jpeg",
    linkedin: "http://www.linkedin.com/in/elewong",
    instagram: "https://www.instagram.com/superpowers_with_ai",
    tiktok: "https://www.tiktok.com/@superpowersai",
    youtube: "",
    email: "el@superpowerswithai.com"
  },
  {
    name: "Anja Lee",
    role: "Team Member",
    bio: "Anja serves on the She Is AI Advisory Council and as an Ambassador, supporting the organization’s work at the intersection of AI education, governance, and real-world adoption. Her focus is practical responsibility: building AI literacy that improves decision-making, reduces harm, and broadens who gets to shape what “good AI” looks like. She collaborates with the community to turn complex AI ideas into clear frameworks, usable tools, and scalable learning.",
    image: "/assets/team/headshot_anja.jpeg",
    linkedin: "http://www.linkedin.com/in/anjalee",
    instagram: "",
    youtube: "",
    email: "anja.lee@gmail.com"
  },
  {
    name: "Dawn Kristy",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "/assets/team/headshot_dawn.jpeg",
    linkedin: "",
    instagram: "",
    youtube: "",
    email: ""
  },
  {
    name: "Wayne Morgan",
    role: "President",
    bio: "As President of SHE IS AI, Wayne Morgan is committed to fostering a more inclusive, culturally diverse, and ethically driven future—both in the development of people and in the evolution of responsible, values-based business. He leads SHE IS AI’s international relations and strategic partnerships, drawing on decades of global experience to build bridges between technology, humanity, and culture. Wayne brings a grounded, people-first mindset to the advancement of ethical AI and sustainable leadership.",
    image: "/assets/team/headshot_wayne.jpg", // Matches screenshot (lowercase w, .jpeg)
    linkedin: "https://www.linkedin.com/in/wayne-morgan",
    instagram: "",
    youtube: "",
    email: "wayne@sheisai.ai"
  },
  {
    name: "Nagawa Lule",
    role: "Vice President",
    bio: "Overseeing strategic growth and operational excellence, ensuring our global initiatives align with our core mission of empowerment, inclusion, and ethical innovation.",
    image: "/assets/team/headshot_nagawa.jpeg",
    linkedin: "http://www.linkedin.com/in/nagawa-l",
    instagram: "",
    youtube: "",
    email: "nagawa@sheisai.ai"
  },
  {
    name: "Lyudmyla Dickinson",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "/assets/team/headshot_lyudmyla.png", // Matches screenshot (.png)
    linkedin: "https://www.linkedin.com/in/lyudmyla-dickinson-457328331/",
    instagram: "",
    youtube: "",
    email: "lyunix13@gmail.com"
  },
  {
    name: "Julia Lewis",
    role: "Queensland Regional Lead",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "/assets/team/headshot_julia.jpeg",
    linkedin: "https://www.linkedin.com/in/julia-lewis-genai/",
    instagram: "",
    youtube: "",
    email: "julia@margaritamedia.com.au"
  },
  {
    name: "Jamie Johnson",
    role: "Team Member",
    bio: "Jamie Nikole serves as a member of the SHE IS AI Ethics & Education Advisory Council, supporting the organization’s mission to advance ethical, inclusive, and human-centered AI adoption. She brings extensive experience helping individuals and organizations navigate the emotional and cultural challenges of adopting new technologies—especially fear, resistance, and uncertainty. Her work focuses on demystifying AI for beginners and fostering responsible, people-first practices that honor dignity, creativity, and trust as technology evolves.",
    image: "/assets/team/headshot_jamie.jpeg",
    linkedin: "https://www.linkedin.com/in/jamienikoledesign/",
    instagram: "",
    youtube: "",
    website: "https://www.jamienikole.com",
    email: "Hello@jamienikole.com"
  },
  {
    name: "Lexi Gilbert",
    role: "Team Member",
    bio: "Lexi Gilbert equips leaders and organizations to adopt AI responsibly by strengthening clarity, cultural alignment, and trust in everyday use. She translates responsible AI into practical guidance teams can apply immediately, including decision habits, workflow guardrails, and human-impact considerations. A certified AI Strategist, Fractional CAIO, and facilitator, Lexi brings 35+ years of entrepreneurial leadership and HR leadership across nine industries. She stays current through emerging AI changes, global AI governance guidance, and international standards for responsible use. As a SHE IS AI Ambassador and member of the Global AI Ethics & Education Advisory Council, she contributes to education design and community initiatives that make responsible AI accessible, culturally aware, and adoptable.",
    image: "/assets/team/headshot_lexi2.jpg",
    linkedin: "http://www.linkedin.com/in/lexigilbert",
    instagram: "",
    youtube: "",
    facebook: "https://www.facebook.com/lllexiG",
    email: "lexi@optimizher.global"
  },
  {
    name: "Mohamed Hafez",
    role: "Team Member",
    bio: `As an Ethical AI & Technology Advisor and CEO of ByteWise LLC, Mr. Hafez brings over 17 years of experience in digital transformation, AI strategy, and responsible technology adoption. He advises organizations on aligning AI innovation with human values, accountability, and long-term societal impact. As an adjunct faculty member at Johns Hopkins University and host of the Beyond the Byte podcast, he bridges executive leadership, education, and public discourse to make ethical AI practical, accessible, and actionable.

As part of the AI Ethics & Education Advisory Council, Mr. Hafez contributes strategic guidance on ethical AI governance, human-centered design, and values-aligned innovation. His work supports SHE IS AI’s mission to advance responsible, people-first AI practices while fostering thoughtful leadership, ethical decision-making, and culturally aware technology adoption across its global community.`,
    image: "/assets/team/headshot_mo.jpg",
    linkedin: "http://www.linkedin.com/in/hafezm",
    instagram: "https://www.instagram.com/beyond.the.byte/",
    youtube: "https://www.youtube.com/@BeyondtheBytePodcast",
    email: "mo@bytewise-llc.com"
  },
  {
    name: "Hayat Ibrahim",
    role: "Team Member",
    bio: `An AI Consultant and Digital Inclusion Specialist dedicated to ensuring emerging technologies remain accessible, ethical, and rooted in human values. With experience in web development, ADA accessibility, and AI-supported content and communication systems, she focuses on bridging technical innovation with inclusive, people-centered design, advocating for AI that protects dignity and expands access for underrepresented communities.

As part of the AI Ethics & Education Advisory Council, she supports the development of people-first guidelines, accessibility standards, Inclusion and community learning initiatives that promote transparent, equitable, and culturally aware AI adoption across the global SHE IS AI movement.`,
    image: "/assets/team/headshot_hayat.jpg", // Matches screenshot (.jpg)
    linkedin: "https://www.linkedin.com/in/hayuni3/",
    instagram: "https://www.instagram.com/hayuni3/",
    youtube: "",
    email: "hayusnn@gmail.com"
  },
  {
    name: "Sara Sheikh",
    role: "Team Member",
    bio: `As a human-first AI and technology consultant, Founder of Saibble, I support women and businesses in adopting AI safely and effectively. With over 30 years of experience in enterprise IT, cybersecurity, and automation, I help organizations design and deploy AI systems that are secure, scalable, and aligned with real business needs.

As part of the AI Delivery Partner and Education Advisory Council, my work focuses on AI adoption, risk awareness, implementation frameworks, and operational automation, helping translate AI education into practical, secure, and human-first solutions that empower women and businesses globally. I am committed to ensuring innovation does not outpace trust, security, or execution.`,
    image: "/assets/team/headshot_sara.png", // Matches screenshot (.jpg)
    linkedin: "https://www.linkedin.com/in/sarasheikhconsultant/",
    instagram: "https://www.instagram.com/sara.sheikh.co/",
    instagram2: "https://www.instagram.com/saibble_ai_security/",
    youtube: "",
    email: "sara@saibble.com"
  }
];

export const Team: React.FC = () => {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Meet the Ethics Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            We are a collective of visionaries, defenders of dignity, and architects of the future. 
            The women behind the manual are dedicated to ensuring AI serves all of humanity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100">
                {/* 
                   --- EFFECT 1: THE ROSE TINT MASK ---
                   bg-rose-900/10: This adds the red tint.
                   group-hover:bg-rose-900/0: This removes the tint when you hover.
                   pointer-events-none: Ensures clicks pass through to the image/links.
                */}
                <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-rose-900/0 transition-colors z-10 pointer-events-none"></div>
                
                <img 
                  src={`${member.image}?v=2`} 
                  alt={member.name}
                  /* 
                     --- EFFECT 2 & 3: GRAYSCALE & ZOOM ---
                     grayscale: Starts Black & White.
                     group-hover:grayscale-0: Turns to Color on hover.
                     group-hover:scale-105: Zooms in 5% on hover.
                     duration-500: Takes 0.5s to animate smoothly.
                  */
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    console.error(`IMAGE LOAD ERROR for ${member.name}. Path tried: ${member.image}`);
                    // DEBUG: If you see the text "IMAGE NOT FOUND" in a gray box, the file path is definitely wrong or file is missing.
                    e.currentTarget.src = `https://placehold.co/400x600/e2e8f0/ef4444?text=IMAGE+NOT+FOUND`;
                  }}
                />
                
                {/* Social Icons Overlay - Only renders if data exists */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <div className="flex gap-4 justify-center text-white">
                    
                    {/* LinkedIn */}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                        <Linkedin className="w-5 h-5 cursor-pointer hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                      </a>
                    )}

                    {/* Instagram */}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Instagram`}>
                        <Instagram className="w-5 h-5 cursor-pointer hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                      </a>
                    )}

                    {/* YouTube (New!) */}
                    {member.youtube && (
                      <a href={member.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s YouTube`}>
                        <Youtube className="w-5 h-5 cursor-pointer hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                      </a>
                    )}

                    {/* Email */}
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                        <Mail className="w-5 h-5 cursor-pointer hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                      </a>
                    )}

                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-rose-600 font-medium text-sm mb-3">{member.role}</p>
              {/* Added whitespace-pre-line to support \n and explicit line breaks */}
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all whitespace-pre-line">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Join the team CTA */}
        <div className="mt-32 bg-gray-50 rounded-[2.5rem] p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-bold mb-4">Join Our Collective</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 font-light">
            Are you passionate about ethical AI and inclusive leadership? We are always looking for ambassadors and contributors.
          </p>
          <a
            href="https://sheisai.ai/ambassadors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-gray-200"
          >
            Apply to be an Ambassador
          </a>
        </div>
      </div>
    </div>
  );
};
