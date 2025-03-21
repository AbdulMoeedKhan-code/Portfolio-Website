import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `

Based on the information from your portfolio website, here's a refined and comprehensive overview that you can incorporate:

---
Portfolio Overview:

About Me
Hi, I'm Abdul Moeed Khan, a passionate web developer and designer dedicated to creating interactive and user-friendly digital experiences. I have hands-on experience working as an intern for 6 months at Codify and 2 months at BXTRACK, where I contributed to web development projects, improved user interfaces, and implemented responsive designs. I also developed websites using HTML, CSS, JavaScript, Python, React, and integrated APIs into websites, showcasing my ability to merge functionality with design. Currently, I'm preparing to pursue further education abroad, aiming to expand my expertise and continue pushing creative boundaries. 

Skills & Expertise
- Programming Languages: JavaScript (85%), HTML5 (98%), CSS3 (97%), Python (80%)
- Frameworks & Libraries: React.js (80%), Tailwind CSS (95%)
- Development Tools: Git, GitHub
- Design Tools: Figma, Adobe XD

Projects
- Weather App: A responsive application providing real-time weather updates using external APIs. 
- ImagineX-AI: An AI-driven platform offering innovative solutions for modern challenges. 
- Rock Paper Scissors Game: An interactive game developed using JavaScript, enhancing user engagement through dynamic features. 
- Brainwave: An AI chatting application facilitating seamless communication between users and AI. 
- E-Commerce Website: A comprehensive online shopping platform with user-friendly interfaces and secure payment integrations. 
- .Sneakers: A niche e-commerce site specializing in sneaker sales, featuring sleek design and smooth navigation. 

Services
- Development: Leveraging cutting-edge technologies, I build robust and scalable web applications that drive business growth and enhance user engagement. 
- Design: With a keen eye for aesthetics and user experience, I craft visually appealing designs that resonate with target audiences and elevate brand identity. 
- eCommerce: Specializing in eCommerce solutions, I create seamless online shopping experiences that boost conversions and foster customer loyalty. 

Experience
- Junior Front End Developer at BX-Track Solutions (Rawalpindi, Pakistan)
  - Duration: Nov 2024 - Jan 2025
  - Role: Contributed to front-end development projects, enhancing user interfaces and ensuring responsive design implementations. 
- Junior Front End Developer at Codify (Private) Limited (Rawalpindi, Pakistan)
  - Duration: May 2024 - Oct 2024
  - Role: Assisted in developing web applications, focusing on improving user experience and integrating modern web technologies. 

Certifications
- College Algebra with Python
  - Institution: Free Code Camp, Inc
  - Duration: 300 hours of work
  - Certificate Link: [View Certificate](https://drive.google.com) 
- Introduction to Artificial Intelligence
  - Institution: Simplilearn | SkillUP
  - Duration: 6 Months
  - Certificate Link: [View Certificate](https://drive.google.com) 
- Responsive Web Design
  - Institution: Free Code Camp, Inc
  - Duration: 300 hours
  - Certificate Link: [View Certificate](https://drive.google.com) 
- Prompt Engineering for ChatGPT
  - Institution: Great Learning
  - Completion Date: July 2024
  - Certificate Link: [View Certificate](https://drive.google.com) 
- JavaScript Algorithms and Data Structures
  - Institution: Free Code Camp, Inc
  - Duration: 300 hours
  - Certificate Link: [View Certificate](https://drive.google.com) 

Education
- High Secondary School Certificate (11th & 12th)
  - Institution: F.G. Sir Syed College
  - Duration: Sep 2021 - Aug 2023
- Secondary School Certificate (9th & 10th)
  - Institution: SLS Montessori And High School
  - Duration: Sep 2019 - Aug 2021

Testimonials
- Noor Lodhi, Founder of Lodhi Cloths:
  > "Working with Abdul Moeed Khan on Lodhi Cloths was a great experience! He built a fast, user-friendly, and stylish e-commerce site that makes shopping easy. Highly recommended!" 
- Emma Davis, Coding Instructor at FreeCodeCamp:
  > "Abdul Moeed Khan is a highly motivated and talented web developer. Their passion for learning 
Contact Me
📞 Phone: +32 466223287
📧 Email: abdulmoeedkhan287@gmail.com
`;

const API_KEY = "AIzaSyDexCSTk7KVAQmnjYY6FaFknHD4b_VZeyw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
});

