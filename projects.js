/* =====================================================================
   PROJECT LIST  —  this is the file you edit to add a project.

   Every entry below becomes a card in the "Projects" scroller on the
   homepage, and the card links to projects/<slug>.html.

   TO ADD A NEW PROJECT
     1. Copy projects/template.html and rename the copy, e.g.
        projects/line-follower.html
     2. Add an entry to the list below with slug: "line-follower"
        (the slug must match the file name, without .html).
     3. Open your new page and fill in the sections.

   FIELDS
     slug     file name of the project page, without .html
     title    project name
     kind     what it was: "Personal project", "Internship", "Design team"...
     when     dates, written however you like
     status   short status shown on the card: "Delivered", "In design"...
     summary  one or two sentences for the card
     tools    list of tools / skills
     color    background colour of the card art and the project page header
     image    a picture for the card, e.g. "my-photo.jpg" (put the file next
              to index.html). Add  blueprint: true  to turn a white-background
              CAD line drawing into white lines on the card colour.
     art      instead of an image, one of the built-in drawings in js/art.js:
              "venturi", "sonar", "lattice". Leave both out and the card
              shows the project's initials.

   The order here is the order on the page. Newest first reads best.
   ===================================================================== */
window.PROJECTS = [
  {
    slug: "digital-manometer",
    title: "Digital differential manometer",
    kind: "Personal project",
    when: "Nov 2026",
    status: "In design",
    summary: "A low-cost instrument that measures small air-pressure differences and logs them to Python. Designed stage by stage; the build comes next.",
    tools: ["Arduino", "C++", "Python"],
    color: "#1b40ad",
    art: "venturi"
  },
  {
    slug: "driving-range-cover",
    title: "Driving range cover",
    kind: "Internship",
    when: "2024 to 2025",
    status: "Delivered",
    summary: "Three SolidWorks designs, 30+ material options and a 20-page report so a golf course could keep its range open through rain and snow.",
    tools: ["SolidWorks", "Cost analysis"],
    color: "#17694a",
    image: "cad-metal-roof_1.jpg",
    blueprint: true
  },
  {
    slug: "assistive-goggles",
    title: "Assistive goggles",
    kind: "Personal project",
    when: "Aug 2025",
    status: "Prototype built",
    summary: "A wearable prototype for people with visual impairments. Ultrasonic sensors measure the distance to obstacles and firmware turns it into audio cues.",
    tools: ["Arduino", "C++", "Sensors"],
    color: "#b4491a",
    art: "sonar"
  },
  {
    slug: "formula-nano",
    title: "Formula Nano design team",
    kind: "Design team",
    when: "Sep 2026 to now",
    status: "Ongoing",
    summary: "Mechanisms for a custom probing tool, and quantum chemistry simulations to check which compounds will work together.",
    tools: ["ORCA", "DFT"],
    color: "#4a32b8",
    art: "lattice"
  }
];
