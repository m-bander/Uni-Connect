export const departments = [
  {name:"Computer Science",color:"#2563eb",courses:[
    ["CS-101","Programming Fundamentals","1","Python, problem solving, functions, and small applications."],
    ["CS-201","Data Structures & Algorithms","2","Lists, trees, graphs, complexity, and practical algorithms."],
    ["CS-301","Operating Systems","3","Processes, memory management, concurrency, and file systems."]]},
  {name:"Software Engineering",color:"#7c3aed",courses:[
    ["SE-201","Object-Oriented Design","2","Model maintainable applications with UML and design patterns."],
    ["SE-301","Software Quality & Testing","3","Test planning, automation, API testing, and defect management."],
    ["SE-401","Graduation Project Studio","4","Build and present a complete software product with your team."]]},
  {name:"Data Science & AI",color:"#0891b2",courses:[
    ["DS-201","Data Analysis with Python","2","Explore and communicate data using pandas and visualizations."],
    ["AI-301","Machine Learning","3","Train, evaluate, and interpret supervised learning models."],
    ["AI-401","Natural Language Processing","4","Text processing, language models, and responsible AI applications."]]},
  {name:"Cybersecurity & Networks",color:"#059669",courses:[
    ["NET-201","Computer Networks","2","TCP/IP, routing, network design, and troubleshooting."],
    ["SEC-301","Web Application Security","3","Threat modeling, authentication, access control, and secure coding."],
    ["SEC-401","Digital Forensics","4","Collect, preserve, and analyze digital evidence."]]},
  {name:"Business & Management",color:"#d97706",courses:[
    ["BUS-101","Principles of Management","1","Planning, leadership, decision making, and teamwork."],
    ["BUS-201","Entrepreneurship","2","Customer research, business models, and startup validation."],
    ["BUS-301","Project Management","3","Scope, scheduling, risks, agile delivery, and stakeholder communication."]]},
  {name:"Mathematics & Statistics",color:"#db2777",courses:[
    ["MTH-101","Calculus I","1","Limits, derivatives, integrals, and engineering applications."],
    ["MTH-201","Linear Algebra","2","Vectors, matrices, transformations, and eigenvalues."],
    ["STA-201","Probability & Statistics","2","Distributions, sampling, hypothesis testing, and uncertainty."]]},
  {name:"Design & Media",color:"#ea580c",courses:[
    ["DES-101","Visual Communication","1","Composition, typography, color, and visual storytelling."],
    ["DES-201","User Experience Design","2","Research, user journeys, prototypes, and usability evaluation."],
    ["MED-301","Digital Media Production","3","Plan, create, and critique digital media projects."]]},
  {name:"Languages & Communication",color:"#4f46e5",courses:[
    ["ENG-101","Academic English","1","Read critically and write clear academic arguments."],
    ["COM-201","Technical Writing","2","Write reports, documentation, proposals, and concise technical explanations."],
    ["COM-301","Presentation & Debate","3","Structure presentations, support arguments, and speak confidently."]]}
];
export const catalogCourses = departments.flatMap(d=>d.courses.map(([code,name,year,description])=>({code,name,year,description,department:d.name,color:d.color})));
export const resourceCategories = ["lecture","sheet","quiz","assignment","tutorial","textbook"] as const;
