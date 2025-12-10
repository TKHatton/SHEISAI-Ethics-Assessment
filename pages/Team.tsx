
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: "Ricquel Harper",
    role: "Director of Education, Ethics & Governance",
    bio: "Leading our educational initiatives and ensuring our ethical frameworks are integrated into every aspect of our governance and curriculum to empower the next generation of AI leaders.",
    image: "assets/team/headshot_ricquel.jpeg"
  },
  {
    name: "Amanda Jeffs",
    role: "Founder | CEO, Operations and Marketing",
    bio: "The visionary behind SHE IS AI, driving our mission to position one million women as leading AI experts through strategic operations, global marketing, and unwavering advocacy.",
    image: "assets/team/headshot_amanda.jpeg"
  },
  {
    name: "El Wong",
    role: "Regional Lead Canada",
    bio: "Spearheading our Canadian initiatives and building strong community partnerships to expand our impact, ensuring local voices are central to our global dialogue.",
    image: "assets/team/headshot_el.jpeg"
  },
  {
    name: "Anja Lee",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_anja.jpeg"
  },
  {
    name: "Dawn Kristy",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_dawn.jpeg"
  },
  {
    name: "Nagawa Lule",
    role: "Vice President",
    bio: "Overseeing strategic growth and operational excellence, ensuring our global initiatives align with our core mission of empowerment, inclusion, and ethical innovation.",
    image: "assets/team/headshot_nagawa.jpeg"
  },
  {
    name: "Lyudmyla Dickinson",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_lyudmyla.jpeg"
  },
  {
    name: "Julia Lewis",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_julia.jpeg"
  },
  {
    name: "Jamie Johnson",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_jamie.jpeg"
  },
  {
    name: "Lexi Gibert",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_lexi.jpeg"
  },
  {
    name: "Mo Hafez",
    role: "Team Member",
    bio: "Dedicated to advancing our mission of ethical AI and inclusive leadership.",
    image: "assets/team/headshot_mo.jpeg"
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
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[3/4]">
                <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-rose-900/0 transition-colors z-10"></div>
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-${1580489944761 + idx}-15a19d654956?q=80&w=1000&auto=format&fit=crop`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <div className="flex gap-4 justify-center text-white">
                    <Linkedin className="w-5 h-5 cursor-pointer hover:text-rose-400" strokeWidth={1.5} />
                    <Twitter className="w-5 h-5 cursor-pointer hover:text-rose-400" strokeWidth={1.5} />
                    <Mail className="w-5 h-5 cursor-pointer hover:text-rose-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-rose-600 font-medium text-sm mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
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
