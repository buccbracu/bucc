export const json = {
  logoFit: "none",
  logoPosition: "right",
  pages: [
    {
      name: "Member Identification",
      elements: [
        {
          type: "text",
          name: "question1",
          title: "Full Name",
          isRequired: true,
          requiredErrorText: "This field is required",
          autocomplete: "name",
          placeholder: "MD. Nafis Sadique Niloy",
        },
        {
          type: "text",
          name: "question2",
          title: "Student ID",
          isRequired: true,
          requiredErrorText: "This field is required",
          validators: [
            {
              type: "regex",
              text: "Enter a valid Student ID",
              regex: "^[0-9]{8}$",
            },
          ],
          placeholder: "2130XXXX",
        },
        {
          type: "text",
          name: "question3",
          title: "G-Suite Email",
          isRequired: true,
          requiredErrorText: "This field is required",
          validators: [
            {
              type: "regex",
              text: "Enter a valid G-Suite Email",
              regex: "^[a-zA-Z0-9\\d\\.]+@g.bracu.ac.bd\\s*$",
            },
          ],
          placeholder: "nafis.sadique.niloy@g.bracu.ac.bd",
        },
      ],
      title: "Member Identification",
    },
    {
      name: "About Yourself",
      elements: [
        {
          type: "text",
          name: "question4",
          title: "Tell us a little about yourself",
          description:
            "E.g. personality, positive and negative sides, achievements, etc.\n\n",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "checkbox",
          name: "question5",
          title: "Why BUCC?",
          description:
            "Why you want to join BUCC. You can select multiple options.",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Want to learn",
            "Want to contribute",
            "Signed up in all the clubs I know",
            "To make new friends",
            "To connect with seniors",
            "Don't know why yet",
          ],
          showOtherItem: true,
        },
        {
          type: "text",
          name: "question6",
          title: "What is your expectation from BUCC?",
          description: "Only write the most interesting one in a line.",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "checkbox",
          name: "question7",
          title: "Which side do you feel most passionate about?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Design and art",
            "Management",
            "Administrative tasks",
            "Writing",
            "Anchoring",
            "Budget handling",
            "Coding",
            "Research",
          ],
        },
      ],
      title: "About Yourself",
    },
    {
      name: "First Preferred Department",
      elements: [
        {
          type: "html",
          name: "Communications & Marketing Details First",
          visibleIf: "{question8} = 'Communications & Marketing'",
          html: "<strong>Communications & Marketing: </strong>This department manages the marketing and advertising efforts of BUCC. Their key responsibilities include promoting upcoming events, workshops, or seminars through online channels or posters. They play a vital role in spreading awareness and attracting participants to BUCC's activities.",
        },
        {
          type: "html",
          name: "Creative Details First",
          visibleIf: "{question8} = 'Creative'",
          html: "<strong>Creative: </strong>This department primarily oversees the creative and design aspects of BUCC. Individuals possessing design skills, graphic work expertise, or unique creative ideas have a strong potential to thrive in this department. Crafting posters, banners, backdrops, brochures, producing videos and motion graphics, and decor events are the focal responsibilities of this department.",
        },
        {
          type: "html",
          name: "Event Management Details First",
          visibleIf: "{question8} = 'Event Management'",
          html: "<strong>Event Management: </strong>This department is responsible for organizing events, handling various tasks such as booking venues like the auditorium and GDLN rooms, arranging food distribution, obtaining guest entry permissions from the Registrar, and managing necessary equipment for events. Additionally, they oversee photography management and storage. Living near the university is preferred for those interested in joining this department.",
        },
        {
          type: "html",
          name: "Finance Details First",
          visibleIf: "{question8} = 'Finance'",
          html: "<strong>Finance: </strong>This department oversees the financial aspects of BUCC, beginning with budget allocation, distribution, and bill submission. Their main responsibilities include tracking bills and writing proposal letters to seek permission from authorities for organizing events or workshops. They play a crucial role in ensuring the smooth financial operation of BUCC's activities.",
        },
        {
          type: "html",
          name: "Human Resources Details First",
          visibleIf: "{question8} = 'Human Resources'",
          html: "<strong>Human Resources: </strong>This department at BUCC is tasked with managing and maintaining member data, allocating volunteers, and ensuring their presence at every event. They handle registration and maintain etiquette among executive bodies, ensuring smooth operation of club activities. Additionally, they notify members about club events or other relevant information through email. If you're organized, communicative, and enjoy working with people, you might have what it takes to excel in HR.",
        },
        {
          type: "html",
          name: "Press Release & Publications Details First",
          visibleIf: "{question8} = 'Press Release & Publications'",
          html: "<strong>Press Release & Publications: </strong>This department takes charge of creating post-event press releases, promotional posts, and publications for all BUCC events. Individuals with writing skills and a penchant for research are encouraged to join this department. They play a crucial role in documenting and publicizing the outcomes of BUCC's events to a wider audience.",
        },
        {
          type: "html",
          name: "Research & Development Details First",
          visibleIf: "{question8} = 'Research & Development'",
          html: "<strong>Research & Development: </strong>The Research & Development department at BUCC focuses on exploring innovative ideas and enhancing the organization's offerings. This team is dedicated to conducting research to improve existing projects and develop new initiatives. Individuals with a passion for exploring new concepts and problem-solving are encouraged to join this department. They play a key role in innovation through their dedication to continuous improvement and forward-thinking strategies.",
        },
        {
          type: "radiogroup",
          name: "question8",
          title: "Preferred Department (1st)",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Communications & Marketing",
            "Creative",
            "Event Management",
            "Finance",
            "Human Resources",
            "Press Release & Publications",
            "Research & Development",
          ],
        },
        {
          type: "checkbox",
          name: "question9",
          title: "Why do you feel this department is interesting?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "I worked in it earlier",
            "I am interested in it",
            "I want to broaden my boundaries",
            "Sounds interesting",
            "My friend is in this department",
            "Don't know why",
          ],
          showOtherItem: true,
        },
      ],
      title: "Preferred Department (1st Choice)",
      description:
        "Choose any of the departments from below and read their respective section before continuing to the next one. Read the description provided for each department carefully before choosing your preferred department. Note that, your entire club journey depends on how you fill up the upcoming sections. We couldn't get the Sorting Hat from Hogwarts, so we need you to be completely honest and precise about your choices. Let's start!",
    },
    {
      name: "Communications & Marketing",
      elements: [
        {
          type: "comment",
          name: "question10",
          title:
            "Write a captivating short caption for the BUCC Fresher's Orientation program.",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "comment",
          name: "question11",
          title:
            "How do you get in touch with other businesses on behalf of a club?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Communications & Marketing'",
      title: "Communications & Marketing",
      description:
        "This department manages the marketing and advertising efforts of BUCC. Their key responsibilities include promoting upcoming events, workshops, or seminars through online channels or posters. They play a vital role in spreading awareness and attracting participants to BUCC's activities.",
    },
    {
      name: "Creative",
      elements: [
        {
          type: "checkbox",
          name: "question12",
          title: "Which creative software can you use or are used to?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Adobe Photoshop",
            "Adobe Illustrator",
            "Adobe After Effects",
            "Adobe Premiere Pro",
            "Blender",
          ],
          showOtherItem: true,
          showNoneItem: true,
        },
        {
          type: "text",
          name: "question13",
          title:
            "Have you done any artwork, design, or edited videos before? If yes, can you show us some of your work?",
          description:
            "Provide a drive link of your content, and don't forget to turn the share option on.",
          isRequired: true,
          requiredErrorText: "This field is required",
          inputType: "url",
        },
        {
          type: "radiogroup",
          name: "question14",
          title:
            "Suppose, you are in the creative department & have basic knowledge of designing. Suddenly you are assigned to create a poster for an event. As it is going to be published in all the social media its design has to be attractive and sophisticated but you don't have any previous experience of creating anything like this. At the same time, you are given a deadline of 2 days. So what would you do?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            {
              value: "Item 1",
              text: "Take help from your graphics designer friend & do your design beautifully",
            },
            {
              value: "Item 2",
              text: "Try to find a software in the internet that can make your work easier but doesn't have as many features",
            },
            {
              value: "Item 3",
              text: "Try to learn more of graphics design and create a cover as sophisticated as possible",
            },
            {
              value: "Item 4",
              text: "Find already done beautiful covers on the internet & just change some tweaks",
            },
          ],
        },
        {
          type: "comment",
          name: "question15",
          title:
            "Imagine, the club is planning an event with a unique theme that totally differs from what you had in mind. How would you boldly take on the challenge of modifying your creative ideas and skill level to fit this unexpected topic, all the while ensuring a smooth and eye-catching result?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Creative'",
      title: "Creative",
      description:
        "This department primarily oversees the creative and design aspects of BUCC. Individuals possessing design skills, graphic work expertise, or unique creative ideas have a strong potential to thrive in this department. Crafting posters, banners, backdrops, brochures, producing videos and motion graphics, and decor events are the focal responsibilities of this department.",
    },
    {
      name: "Event Management",
      elements: [
        {
          type: "radiogroup",
          name: "question16",
          title: "Do you have an interest in photography?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Yes and I have a camera",
            "Yes but I don't have a camera",
            "I do only mobile photography",
            "No",
          ],
        },
        {
          type: "text",
          name: "question17",
          title:
            "If you have an interest in photography, can you show us some of your works?",
          description:
            "Provide a drive link of your photos, and don't forget to turn the share option on.",
          isRequired: true,
          requiredErrorText: "This field is required",
          inputType: "url",
        },
        {
          type: "boolean",
          name: "question18",
          title: "Have you organized any event before?",
          isRequired: true,
          requiredErrorText: "This field is required",
          valueTrue: "Yes",
          valueFalse: "No",
        },
        {
          type: "comment",
          name: "question19",
          title:
            "What makes an event successful and how do you measure that success?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "comment",
          name: "question20",
          title:
            "In the club, you will get to know students from various semesters. You are assigned to manage an event with other fellow club members. How would you manage to cope with juniors and seniors?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "rating",
          name: "question21",
          title:
            "How do you rate your negotiation skills with third parties such as stationery shops, Hardware shops, Restaurants, etc?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Event Management'",
      title: "Event Management",
      description:
        "This department is responsible for organizing events, handling various tasks such as booking venues like the auditorium and GDLN rooms, arranging food distribution, obtaining guest entry permissions from the Registrar, and managing necessary equipment for events. Additionally, they oversee photography management and storage. Living near the university is preferred for those interested in joining this department.",
    },
    {
      name: "Finance",
      elements: [
        {
          type: "boolean",
          name: "question22",
          title:
            "Have you ever worked related to finance or made a budget before?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "comment",
          name: "question23",
          title: "What makes a successful budget?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Finance'",
      title: "Finance",
      description:
        "to organizeThis department oversees the financial aspects of BUCC, beginning with budget allocation, distribution, and bill submission. Their main responsibilities include tracking bills and writing proposal letters to seek permission from authorities for organizing events or workshops. They play a crucial role in ensuring the smooth financial operation of BUCC's activities.",
    },
    {
      name: "Human Resources",
      elements: [
        {
          type: "checkbox",
          name: "question24",
          title:
            "Sabrina is a member of the X department. She has to write an email to all the members of the whole club. But she is struggling to write an email that is appropriate for this whole crowd. So what would be the most logical solution to this problem?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Search the internet there are plenty of resources to get ideas from",
            "Ask seniors to teach her how to write an organised email",
            "Create an appropriate email by discussing with a friend",
            "Search for youtube videos to get ideas about it as you are a listening learner",
          ],
          showOtherItem: true,
        },
        {
          type: "comment",
          name: "question25",
          title: "What is the greatest secret you have kept till now?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Human Resources'",
      title: "Human Resources",
      description:
        "This department at BUCC is tasked with managing and maintaining member data, allocating volunteers, and ensuring their presence at every event. They handle registration and maintain etiquette among executive bodies, ensuring smooth operation of club activities. Additionally, they notify members about club events or other relevant information through email. If you're organized, communicative, and enjoy working with people, you might have what it takes to excel in HR.",
    },
    {
      name: "Press Release & Publications",
      elements: [
        {
          type: "text",
          name: "question26",
          title:
            "If you have written any articles, short stories, or novels before, can you show us some of your works?",
          description:
            "Provide a drive link, or website links (if published) of your writings, and don't forget to turn the share option on.",
          isRequired: true,
          requiredErrorText: "This field is required",
          inputType: "url",
        },
        {
          type: "radiogroup",
          name: "question27",
          title:
            "What qualities do you think a published news portal article should have among these?",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Concise",
            "Large Para",
            "Poetic",
            "In third person",
            "Objectivity",
          ],
          showOtherItem: true,
        },
        {
          type: "comment",
          name: "question28",
          title:
            "What do you think about ChatGPT? Is it good to use ChatGPT in institutional/organizational writings?",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
      ],
      visibleIf: "{question8} = 'Press Release & Publications'",
      title: "Press Release & Publications",
      description:
        "This department takes charge of creating post-event press releases, promotional posts, and publications for all BUCC events. Individuals with writing skills and a penchant for research are encouraged to join this department. They play a crucial role in documenting and publicizing the outcomes of BUCC's events to a wider audience.",
    },
    {
      name: "Research & Development",
      elements: [
        {
          type: "checkbox",
          name: "question29",
          title:
            "Are you developing any skills right now? If yes specify what kind of skills you are developing.",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Competitive Programming",
            "Web Development",
            "App Development",
            "Cyber Security",
            "Machine Learning",
            "Artificial Intelligence",
          ],
          showOtherItem: true,
        },
        {
          type: "comment",
          name: "question30",
          title:
            "Do you have any projects regarding your selected skills? If yes give us a description about your project. If it's regarding problem solving describe that as well.",
          isRequired: true,
          requiredErrorText: "This field is required",
        },
        {
          type: "text",
          name: "question31",
          title: "Give us the GitHub, Google, or Live Link of your project.",
          description:
            "Provide a github, drive link, or live link (if deployed) of your project, and don't forget to turn the share option on if providing a drive link. If it's any online portfolio (Leetcode, Codeforces, Portfolio Website, etc) you can attach that as well.",
          isRequired: true,
          requiredErrorText: "This field is required",
          inputType: "url",
        },
      ],
      visibleIf: "{question8} = 'Research & Development'",
      title: "Research & Development",
      description:
        "The Research & Development department at BUCC focuses on exploring innovative ideas and enhancing the organization's offerings. This team is dedicated to conducting research to improve existing projects and develop new initiatives. Individuals with a passion for exploring new concepts and problem-solving are encouraged to join this department. They play a key role in innovation through their dedication to continuous improvement and forward-thinking strategies.",
    },
    {
      name: "Second Preferred Department",
      elements: [
        {
          type: "html",
          name: "Communications & Marketing Details Second",
          visibleIf: "{question32} = 'Communications & Marketing'",
          html: "<strong>Communications & Marketing: </strong>This department manages the marketing and advertising efforts of BUCC. Their key responsibilities include promoting upcoming events, workshops, or seminars through online channels or posters. They play a vital role in spreading awareness and attracting participants to BUCC's activities.",
        },
        {
          type: "html",
          name: "Creative Details Second",
          visibleIf: "{question32} = 'Creative'",
          html: "<strong>Creative: </strong>This department primarily oversees the creative and design aspects of BUCC. Individuals possessing design skills, graphic work expertise, or unique creative ideas have a strong potential to thrive in this department. Crafting posters, banners, backdrops, brochures, producing videos and motion graphics, and decor events are the focal responsibilities of this department.",
        },
        {
          type: "html",
          name: "Event Management Details Second",
          visibleIf: "{question32} = 'Event Management'",
          html: "<strong>Event Management: </strong>This department is responsible for organizing events, handling various tasks such as booking venues like the auditorium and GDLN rooms, arranging food distribution, obtaining guest entry permissions from the Registrar, and managing necessary equipment for events. Additionally, they oversee photography management and storage. Living near the university is preferred for those interested in joining this department.",
        },
        {
          type: "html",
          name: "Finance Details Second",
          visibleIf: "{question32} = 'Finance'",
          html: "<strong>Finance: </strong>This department oversees the financial aspects of BUCC, beginning with budget allocation, distribution, and bill submission. Their main responsibilities include tracking bills and writing proposal letters to seek permission from authorities for organizing events or workshops. They play a crucial role in ensuring the smooth financial operation of BUCC's activities.",
        },
        {
          type: "html",
          name: "Human Resources Details Second",
          visibleIf: "{question32} = 'Human Resources'",
          html: "<strong>Human Resources: </strong>This department at BUCC is tasked with managing and maintaining member data, allocating volunteers, and ensuring their presence at every event. They handle registration and maintain etiquette among executive bodies, ensuring smooth operation of club activities. Additionally, they notify members about club events or other relevant information through email. If you're organized, communicative, and enjoy working with people, you might have what it takes to excel in HR.",
        },
        {
          type: "html",
          name: "Press Release & Publications Details Second",
          visibleIf: "{question32} = 'Press Release & Publications'",
          html: "<strong>Press Release & Publications: </strong>This department takes charge of creating post-event press releases, promotional posts, and publications for all BUCC events. Individuals with writing skills and a penchant for research are encouraged to join this department. They play a crucial role in documenting and publicizing the outcomes of BUCC's events to a wider audience.",
        },
        {
          type: "html",
          name: "Research & Development Details Second",
          visibleIf: "{question32} = 'Research & Development'",
          html: "<strong>Research & Development: </strong>The Research & Development department at BUCC focuses on exploring innovative ideas and enhancing the organization's offerings. This team is dedicated to conducting research to improve existing projects and develop new initiatives. Individuals with a passion for exploring new concepts and problem-solving are encouraged to join this department. They play a key role in innovation through their dedication to continuous improvement and forward-thinking strategies.",
        },
        {
          type: "radiogroup",
          name: "question32",
          title: "Preferred Department (2nd)",
          isRequired: true,
          requiredErrorText: "This field is required",
          choices: [
            "Communications & Marketing",
            "Creative",
            "Event Management",
            "Finance",
            "Human Resources",
            "Press Release & Publications",
            "Research & Development",
            "Skip",
          ],
        },
      ],
      title: "Preferred Department (2nd Choice)",
      description:
        "Choose any of the departments from below and read their respective section before continuing to the next one. Read the description provided for each department carefully before choosing your 2nd preferred department.",
    },
    {
      name: "Brain Teaser",
      elements: [
        {
          type: "text",
          name: "question33",
          title:
            "Rearrange/Anagram this line in such a way that it produces the same output: ELEVEN PLUS ONE",
        },
        {
          type: "image",
          name: "Brain Teaser Question 2 Image",
          imageLink:
            "https://api.surveyjs.io/private/Surveys/files?name=f0856d25-ff3d-4ffa-aa40-ba3bda9982d0",
          imageFit: "cover",
          imageHeight: "auto",
          imageWidth: "100%",
        },
        {
          type: "radiogroup",
          name: "question34",
          title: " What is the output of the code given above?\n",
          description:
            "Just to check how sincere you are with your studies. This should be a piece of cake if you are done with the lectures of week 3 of the CSE110 course. \nP:S Don't use any IDE to solve this, try to solve it without anyone's help",
          choices: [
            "Error: float and int collision",
            "Error: cannot access local variable 'my_var'",
            "Error: syntax error",
            "Outside function 30, Inside function 15.0, Outside function 15.0",
            "Outside function 30, Inside function 15, Outside function 15",
            "No Output",
          ],
        },
        {
          type: "text",
          name: "question35",
          title: "Where is the ‘Any Key’ on your keyboard?",
          description: "Prompt: Press any key to continue.",
        },
        {
          type: "text",
          name: "question36",
          title: "What did the computer do at lunchtime?",
          description: "Hint: Bit, Byte, Burger",
        },
        {
          type: "text",
          name: "question37",
          title: "How do you go from 98 to 720 using just one letter?",
          description: "Use Mathematical symbol like +, -, x, ÷",
        },
        {
          type: "expression",
          name: "question38",
          title:
            "Alan Turing was trying to crack enigma. He saw that it encrypts “HEIL HITLER” into “MJNQ MNYQFW”. Now decode the messages given below if you can.",
          description:
            "Look at the image in the bottom if you need any help. But I will encourage you not to look. Please try to crack it by yourself first.",
        },
        {
          type: "image",
          name: "Brain Teaser Question 6 7 Image",
          imageLink:
            "https://api.surveyjs.io/private/Surveys/files?name=1f0855ca-cc35-48f2-90f4-7a16ad2a559f",
          imageFit: "cover",
          imageHeight: "auto",
          imageWidth: "100%",
        },
        {
          type: "text",
          name: "question39",
          title: "GZHH NX NS TZW MJFWY",
        },
        {
          type: "text",
          name: "question40",
          title: "MJNQ GZHH",
        },
      ],
      title: "Brain Teaser",
      description:
        "Congratulations! You have come a long way. Now, go have a glass of water and stretch yourself because now it is time to stress your brain. This is the last step so give it your all!",
    },
  ],
};
