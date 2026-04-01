Software Requirements Specification
for
GenMark: Generative AI Tool For
Marketing Content Creation
Prepared by
Group Name: SE-07
Zainab
22-SE-004
22-se-004@student.hitecuni.edu.pk
Nimra Sultan
22-SE-080
22-se-080@student.hitecuni.edu.pk
Talha Ghafoor
22-SE-096
22-se-096@student.hitecuni.edu.pk
Instructor:
Ma’am Hira Khalid
Course:
Final Year Project
Lab Section:
---
Teaching Assistant:
Ma’am Amber Urooj
Date:
21-01-2026
Table of Content
TOC \o "1-3" \h \z \u 1.Introduction PAGEREF _Toc219805953 \h 1
Document Purpose PAGEREF _Toc219805954 \h 1
1.1.Product Scope PAGEREF _Toc219805955 \h 2
1.2.Intended Audience and Document Overview PAGEREF _Toc219805956 \h 2
1.4.Document Conventions PAGEREF _Toc219805957 \h 3
1.5.References and Acknowledgments PAGEREF _Toc219805958 \h 4
2.Overall Description PAGEREF _Toc219805959 \h 5
2.1.Product Overview PAGEREF _Toc219805960 \h 5
2.2.Design and Implementation Constraints PAGEREF _Toc219805961 \h 6
3.Specific Requirements PAGEREF _Toc219805962 \h 7
3.1.External Interface Requirements PAGEREF _Toc219805963 \h 7
3.1.1.User Interfaces PAGEREF _Toc219805964 \h 7
3.1.2.Hardware Interfaces PAGEREF _Toc219805965 \h 8
3.1.3.Software Interfaces PAGEREF _Toc219805966 \h 8
3.2.Functional Requirements PAGEREF _Toc219805967 \h 9
3.2.1.The System Shall (Core Functional Requirements) PAGEREF _Toc219805968 \h 9
3.2.2.Functional Requirement or Feature: PAGEREF _Toc219805969 \h 10
3.2.3.Use Case 01: Authentication And Authorization PAGEREF _Toc219805970 \h 10
3.2.4.Use Case 02: User Registration PAGEREF _Toc219805971 \h 11
3.2.5.Use Case-03: Create Project PAGEREF _Toc219805972 \h 12
3.2.6.Use Case-04: Create Brand Kit PAGEREF _Toc219805973 \h 13
3.2.7.Use Case-05: Generate Image Form Text PAGEREF _Toc219805974 \h 13
3.2.8.Use Case-06: Generate Text Form Image PAGEREF _Toc219805975 \h 14
3.2.9.Use Case-07: Preview Generated Content PAGEREF _Toc219805976 \h 15
3.2.10.Use Case-08: Edit Generated Content PAGEREF _Toc219805977 \h 16
3.2.11.Use Case-09: Download/Export Content PAGEREF _Toc219805978 \h 17
3.2.12.Use Case-10: Asset Library Management PAGEREF _Toc219805979 \h 17
3.2.13.Use Case-11: Veiw DashBoard And Analytics PAGEREF _Toc219805980 \h 18
3.2.14.Use Case-12: Manage Users and Roles PAGEREF _Toc219805981 \h 19
3.2.15.Use Case 013– Full System PAGEREF _Toc219805982 \h 20
4.Other Non-Functional Requirements PAGEREF _Toc219805983 \h 21
4.1.Performance Requirements PAGEREF _Toc219805984 \h 21
4.2.Safety and Security Requirements PAGEREF _Toc219805985 \h 21
4.3.Software Quality Attributes PAGEREF _Toc219805986 \h 22
5.Design Requirements: PAGEREF _Toc219805987 \h 23
5.1.High Level Design: PAGEREF _Toc219805988 \h 23
5.1.1.Abstract design/Block Diagram: PAGEREF _Toc219805989 \h 23
5.1.2.Design oblige Architecture Patterns PAGEREF _Toc219805990 \h 23
5.2.Structural Design PAGEREF _Toc219805991 \h 24
5.2.1.Class Diagram PAGEREF _Toc219805992 \h 24
5.2.2.Component Diagram PAGEREF _Toc219805993 \h 25
5.2.3.DFD PAGEREF _Toc219805994 \h 25
5.3.Behavioral Design PAGEREF _Toc219805995 \h 28
5.3.1.Use Case Diagram PAGEREF _Toc219805996 \h 28
5.3.2.Sequence Diagrams PAGEREF _Toc219805997 \h 29
5.3.3.Activity Diagrams PAGEREF _Toc219805998 \h 31
5.3.4.Prototype PAGEREF _Toc219805999 \h 35
6.Data Design and Relationships PAGEREF _Toc219806000 \h 35
6.1.Database Schema PAGEREF _Toc219806001 \h 35
6.2.Entity Relationship Diagram PAGEREF _Toc219806002 \h 35
6.3.Data Dictionary PAGEREF _Toc219806003 \h 35
7.Software Planning and Timeline PAGEREF _Toc219806004 \h 35
7.1.Work Breakdown Structure PAGEREF _Toc219806005 \h 36
7.2.Milestones and Deliverables PAGEREF _Toc219806006 \h 36
7.3.Detailed Baseline Plan PAGEREF _Toc219806007 \h 37
8.Quality Assurance Plan PAGEREF _Toc219806008 \h 37
8.1.Testing Requirements PAGEREF _Toc219806009 \h 37
8.2.Acceptance Criteria PAGEREF _Toc219806010 \h 37
8.3.Planned Test Suite and Test Cases PAGEREF _Toc219806011 \h 38
8.3.1.Test Cases PAGEREF _Toc219806012 \h 38
8.3.2.Test Suite PAGEREF _Toc219806013 \h 44
9.Configuration Management Plan: PAGEREF _Toc219806014 \h 45
9.1.Scope And Reference PAGEREF _Toc219806015 \h 45
9.1.1.Scope PAGEREF _Toc219806016 \h 45
9.1.2.References PAGEREF _Toc219806017 \h 47
9.2.Definitions and Acronyms PAGEREF _Toc219806018 \h 48
9.2.1.Definitions PAGEREF _Toc219806019 \h 48
9.2.2.Acronyms PAGEREF _Toc219806020 \h 48
9.3.Software Configuration Management Plan PAGEREF _Toc219806021 \h 48
9.3.1.Introduction PAGEREF _Toc219806022 \h 48
9.3.2.Management PAGEREF _Toc219806023 \h 50
9.3.3.SCM Activities PAGEREF _Toc219806024 \h 54
9.3.4.Tools, Techniques, and Methodologies PAGEREF _Toc219806025 \h 59
9.3.5.Record Collection and Retention PAGEREF _Toc219806026 \h 59
Table Of Figures:
TOC \h \z \c "Figure" Figure 1 Block Diagram PAGEREF _Toc219824227 \h 23
Figure 2: GenMark Class Diagram PAGEREF _Toc219824228 \h 24
Figure 3: Component Diagram-GenMark PAGEREF _Toc219824229 \h 25
Figure 4: Data Flow Diagram-Level 0 PAGEREF _Toc219824230 \h 25
Figure 5: Data Flow Diagram-Level 1 PAGEREF _Toc219824231 \h 26
Figure 6: Data Flow Diagram-Level 2a PAGEREF _Toc219824232 \h 27
Figure 7:Text To Image-Sequence Diagram PAGEREF _Toc219824233 \h 29
Figure 9: Activity Diagram-User Login PAGEREF _Toc219824234 \h 29
Figure 10: Activity Diagram-User Login PAGEREF _Toc219824235 \h 30
Figure 11: Activity Diagram-User Login PAGEREF _Toc219824236 \h 31
Figure 12: Activity Diagram-Text To Image PAGEREF _Toc219824237 \h 32
Figure 13:Activity Diagram-Image to text PAGEREF _Toc219824238 \h 33
Figure 14: Activity Diagram-Brand kit Management PAGEREF _Toc219824239 \h 34
Figure 15: ERD-GenMark PAGEREF _Toc219824240 \h 35
Content
TOC \h \z \c "Table" Table 1: Definitions, Acronyms and Abbreviations PAGEREF _Toc219806027 \h 2
Table 2Document Convention PAGEREF _Toc219806028 \h 3
Table 3: Naming Conventions PAGEREF _Toc219806029 \h 4
Table 4: Typographical Conventions PAGEREF _Toc219806030 \h 4
Table 5: Authentication PAGEREF _Toc219806031 \h 10
Table 6: User Registration PAGEREF _Toc219806032 \h 11
Table 7: Create project PAGEREF _Toc219806033 \h 12
Table 8:Create brand Kit PAGEREF _Toc219806034 \h 13
Table 9: Generate Image form Text PAGEREF _Toc219806035 \h 13
Table 10: generate text to Image PAGEREF _Toc219806036 \h 14
Table 11: Preview Content PAGEREF _Toc219806037 \h 15
Table 12 Edit Content PAGEREF _Toc219806038 \h 16
Table 13: Download export PAGEREF _Toc219806039 \h 17
Table 14: Asset library Management PAGEREF _Toc219806040 \h 17
Table 15:View Download and Analytics PAGEREF _Toc219806041 \h 18
Table 16 manage User and Roles PAGEREF _Toc219806042 \h 19
Table 17 Full System Integration PAGEREF _Toc219806043 \h 20
Table 18:Milestone &amp; Deliverables PAGEREF _Toc219806044 \h 36
Table 19:User Registration PAGEREF _Toc219806045 \h 38
Table 20 TS 02: Authentication &amp; Authorization PAGEREF _Toc219806046 \h 39
Table 21: Project Creation PAGEREF _Toc219806047 \h 39
Table 22: Brand kit management PAGEREF _Toc219806048 \h 40
Table 23 Text To Text Generation PAGEREF _Toc219806049 \h 41
Table 24 Image To Text Generation PAGEREF _Toc219806050 \h 41
Table 25 Assets Library Management PAGEREF _Toc219806051 \h 42
Table 26: Dashboard &amp; Analytics PAGEREF _Toc219806052 \h 42
Table 27: Full System Integration PAGEREF _Toc219806053 \h 43
Table 28 Test Suites PAGEREF _Toc219806054 \h 44
Table 29 SCM Organization PAGEREF _Toc219806055 \h 50
Table 30 SCM Responsibilities PAGEREF _Toc219806056 \h 50
Table 31 SCMP Implementation PAGEREF _Toc219806057 \h 51
Table 32 Identification of SPB PAGEREF _Toc219806058 \h 54
Table 33 Authority for Change Approval PAGEREF _Toc219806059 \h 55
Table 34: CCB PAGEREF _Toc219806060 \h 56
Table 35 UAG PAGEREF _Toc219806061 \h 56
Table 36 Configuration Items Covered PAGEREF _Toc219806062 \h 58
Introduction
As the world becomes increasingly dependent on digital marketing and online branding, the demand for high-quality visual content is growing rapidly. The challenge of producing creative, consistent, and engaging marketing assets within tight deadlines, across multiple platforms, and for diverse audiences has significantly increased the complexity of content creation. Traditional design tools and manual workflows often require substantial time, expertise, and resources, making it difficult for marketers and businesses to scale their content production efficiently. These limitations frequently result in inconsistent branding, delayed campaign execution, and reduced creative productivity. The intent of this project is to develop a generative marketing system, GenMark, which integrates Artificial Intelligence with modern web-based content creation practices to support marketers, designers, and businesses in managing and generating marketing assets. By automating the process of creating visual content through AI-driven text-to-image and image-to-text generation, analysing creative inputs, and managing projects and brand resources, GenMark provides users with a centralized platform to create, store, and organize marketing content. The system ensures secure access through role-based authorization while supporting asynchronous AI processing for improved performance. GenMark enables users to increase productivity, maintain brand consistency, and make data-driven creative decisions through intelligent automation and AI-assisted content generation.
Document Purpose
This document provides a comprehensive description of the functional and non-functional requirements for the GenMark software system. The Software Requirements Specification (SRS) outlines the expected behavior of the system, the interactions between users and system components, and the constraints under which the system operates in order to align expectations among all stakeholders, including users, developers, and project supervisors. Throughout the software development lifecycle, this document will serve as a primary reference for system architecture, implementation, testing, validation, and future maintenance activities. Additionally, this document acts as a formal agreement between the development team and stakeholders by clearly defining and documenting all approved system requirements in an official and structured manner.
Product Scope
GenMark is a modern AI-powered generative marketing application designed to enhance creativity, efficiency, and brand consistency in digital content creation. The GenMark system enables users to create and manage marketing projects, generate visual content using text-to-image and image-to-text AI models, organize brand assets, and store generated content through a centralized platform. GenMark leverages artificial intelligence to automate and enhance content generation, analyze creative inputs, maintain branding guidelines, and support scalable content production workflows. The system allows for the management of users and user roles, provides real-time progress tracking for generation tasks, supports asynchronous processing, and delivers intelligent recommendations to improve creative outcomes. GenMark supports multiple user roles, including marketers, designers, and administrators, while ensuring secure access to the system through role-based authorization mechanisms.
Intended Audience and Document Overview
This document is intended for all individuals involved in the GenMark project, including academic supervisors, software developers, system architects, quality assurance personnel, and end-users. The purpose of this document is to provide both technical and non-technical stakeholders with a clear and comprehensive understanding of the system requirements, functionalities, and expected operational behaviour of the GenMark platform. This document is organized into multiple sections. The initial sections provide a high-level overview of the GenMark system and its objectives. The subsequent sections present detailed descriptions of the system components, including system features, functional and non-functional requirements, use case models, system diagrams, and testing considerations. Although each section can be read independently, all sections collectively contribute to a complete and thorough understanding of the GenMark system.
Definitions, Acronyms and Abbreviations
Table SEQ Table \* ARABIC 1: Definitions, Acronyms and Abbreviations
Term / Acronym
Description
GenMark
AI-powered Generative Marketing System
AI
Artificial Intelligence
SRS
Software Requirements Specification
UI
User Interface
CDN
Content Delivery network
NLP
Natural Level processing
UC
Use Case
API
Application Programming Interface
Document Conventions
This document follows standard SRS documentation conventions to ensure clarity and consistency. Section and subsection numbering follows IEEE SRS guidelines. Use cases, requirements, and test cases are uniquely identified using predefined IDs. Tables are used extensively to present structured information such as use case descriptions and test scenarios.
Keywords such as “shall”, “should”, and “may” are used to indicate requirement priority and obligation levels. Diagrams are included where necessary to visually represent system interactions and architecture.
Table SEQ Table \* ARABIC 2Document Convention
Font
All text is written in Time New Roman, size 12.
Spacing
The document uses single spacing throughout.
Margins
Standard 1.5-inch margins are maintained on all sides of the document.
Section and subsection Titles
Titles are formatted according to the template and are in bold to distinguish them from the body text.
Naming Conventions:
Table 3: Naming Conventions
NC-1
Acronyms and abbreviations are defined when first mentioned and are then used consistently throughout the document.
NC-2
Any technical or domain-specific terms are italicized the first time they appear in the document.
NC-3
Headings are numbered sequentially, and subsections are indented properly to ensure a clear hierarchy and structure.
Typographical Conventions
Table SEQ Table \* ARABIC 4: Typographical Conventions
Comments
Comments and additional notes are written in italics to distinguish them from the main body text.
Emphasis
To emphasize particular points or terms, bold text is used
Code or variable
Any code snippets, variable names, or technical terms are presented in monospaced font.
References and Acknowledgments
This Software Requirements Specification (SRS) document has been developed in accordance with established software engineering standards and conventions, following the recommended IEEE SRS guidelines. It incorporates input from various academic resources provided by universities that address key areas of software development, including software engineering, artificial intelligence, and web-based system design. The document draws upon material collected from multiple sources such as course readings, research publications, textbooks, and relevant web resources that support the development of intelligent and AI-driven web applications.
The authors would like to express their sincere appreciation to their professors and academic supervisors for the guidance and support provided during the requirements analysis and documentation phases of the project. This document presents a consolidated overview of the purpose and major features of the GenMark system, along with its design and development constraints, assumptions, and dependencies, offering a structured understanding of the system without detailing every specific requirement at this stage.
Overall Description
This section provides a high-level overview of the GenMark system, including its purpose, major functionalities, constraints affecting its design and implementation, and the assumptions and dependencies under which the system will operate. It offers stakeholders a clear understanding of the overall system context without delving into detailed functional or non-functional requirements.
Product Overview
GenMark is a web-based generative marketing application designed for marketers, designers, and businesses that enables the use of artificial intelligence to automate and enhance the creation of digital marketing content. The system applies AI-driven techniques to support multiple stages of the creative workflow, including content ideation, text-to-image generation, image-to-text analysis, brand asset management, and campaign content organization through intelligent automation and data-driven processes.
The system is intended to be used by marketers, creative team members, and system administrators through a centralized platform accessible via modern web browsers. GenMark operates as an independent system but may integrate with external AI services and cloud platforms for content generation and analysis. Its primary objective is to improve creative productivity, maintain brand consistency, and support informed marketing decisions by reducing manual design effort and minimizing human error.
Product Functionality
GenMark provides a comprehensive range of core and advanced functionalities to support AI-driven content creation and brand management activities. The major functional capabilities of the system include:
• User authentication and role-based authorization to ensure secure access to the platform
• Project creation, modification, and organization to manage marketing campaigns and content workflows
• Brand Kit management including logos, colors, fonts, and brand guidelines for consistent content generation
• Text-to-image generation using AI models based on user-defined prompts and brand constraints
• Image-to-text analysis to generate descriptions, captions, and marketing insights from uploaded images
• AI-based brand consistency checks to ensure generated content aligns with defined brand guidelines
• Real-time dashboards displaying generation status, usage statistics, and performance analytics
• Asset storage, search, filtering, and reuse through a centralized asset library
• Preview, edit, download, and export of generated marketing content in multiple formats
• Administrative management of users, roles, system configurations, and content policies
Design and Implementation Constraints
The design and implementation of GenMark are subject to several constraints that must be considered throughout the development process:
The system will be implemented as a web-based application using standard and widely adopted web technologies.
Artificial intelligence features depend on the availability, quality, and relevance of training and input data provided to the system.
System performance is constrained by available server resources, cloud infrastructure limitations, and network availability.
Security constraints require the implementation of robust authentication, authorization, and data protection mechanisms to safeguard user and brand data.
The system must comply with academic guidelines, evaluation criteria, and timelines defined for the Final Year Project.
The development tools, frameworks, and libraries selected must be compatible with the chosen deployment and hosting environment.
Assumptions and Dependencies
To the successful operation of GenMark, the following assumptions and dependencies are identified:
Users are assumed to have a basic understanding of digital marketing concepts and content creation workflows.
Users will have access to a stable internet connection and will use a modern, standards-compliant web browser to access the system.
All text prompts, images, and brand-related data provided by users are assumed to be accurate, relevant, and up to date.
The effectiveness of AI-based content generation and analysis depends on the availability and quality of input data supplied to the system.
GenMark’s functionality relies on third-party libraries, frameworks, and AI services for content generation, image analysis, cloud storage, and backend processing.
The system depends on the availability and proper functioning of external services and integrations utilized within the platform.
Identifying these assumptions and dependencies helps define the operational boundaries of the GenMark system and highlights potential risks associated with its deployment and usage.
Specific Requirements
The GenMark Requirements Document defines the detailed requirements for the GenMark system, including external interface requirements, functional requirements, and the use case model. These requirements describe how GenMark interacts with users and other external components, as well as how the system behaves under various operational scenarios. The specifications outlined in this section clearly define what the system is expected to do in different situations to ensure consistent and predictable system behavior.
External Interface Requirements
Thus, this section describes the interaction between the GenMark system, hardware and software components (i.e., users).
User Interfaces
The GenMark system will provide a web-based graphical user interface (GUI) that is intuitive, responsive, and user-friendly. Users will access the interface through standard modern web browsers, and the design will follow established usability and accessibility standards to ensure an efficient user experience. Some of the major features of the GenMark user interface include:
Login, registration, and secure authentication screens.
Role-based dashboards for marketers, creative users, and administrators.
Project and Brand Kit management screens for organizing campaigns and brand assets.
Content generation interfaces for text-to-image and image-to-text operations.
Asset library, preview, editing, and download panels.
Analytics and insights dashboards displaying usage statistics and content performance.
The interface will maintain a consistent layout, readable typography, and clear visual cues to enhance usability, reduce the learning curve, and improve overall user satisfaction.
Hardware Interfaces
The GenMark system does not require any specialized hardware for end users to operate the application. GenMark will function on any standard computing device capable of accessing a modern web browser. To use the GenMark system, the following minimum hardware requirements apply:
A computing device such as a desktop computer, laptop, tablet, or smartphone.
A stable internet connection to access the web-based application.
A server or cloud-based environment to host and run the GenMark application.
No direct hardware-level interaction is required from end users, as all system functionality is accessed through the web interface.
Software Interfaces
The GenMark system requires integration with multiple software components to operate effectively:
A web browser (e.g., Chrome, Firefox, Edge) to provide access to the user interface.
A backend application server to handle business logic, request processing, and system coordination.
A database management system (RDBMS) to store user data, project information, brand kits, and generated content metadata.
Artificial intelligence and machine learning (AI/ML) services and frameworks to support text-to-image generation, image-to-text analysis, and brand consistency validation.
Cloud storage and notification services to manage media assets, system alerts, and user notifications.
All interfaces between these software components will communicate using secure, standardized protocols and APIs to ensure data integrity, security, and reliable system operation.
Functional Requirements
This subsection defines the functional requirements of the GenMark system. Each requirement is assigned a unique identifier and uses the keyword “shall” to specify mandatory system behavior. These requirements describe what the system must do to support AI-driven content generation, brand management, and user interaction.
The System Shall (Core Functional Requirements)
FR-01: The system shall allow users to register, log in, and log out using valid credentials.
FR-02: The system shall authenticate users and enforce role-based access control for secure system usage.
FR-03: The system shall allow users to create, update, view, and delete marketing projects.
FR-04: The system shall allow users to create and manage Brand Kits containing logos, colors, fonts, and brand guidelines.
FR-05: The system shall allow users to generate images from text prompts using AI models.
FR-06: The system shall allow users to generate textual descriptions, captions, or insights from uploaded images.
FR-07: The system shall ensure brand consistency in generated content by applying Brand Kit constraints.
FR-08: The system shall allow users to preview, edit, and download generated content.
FR-09: The system shall store generated content and uploaded assets in a centralized asset library.
FR-10: The system shall allow users to search, filter, and reuse stored assets across projects.
FR-11: The system shall display dashboards showing generation history, usage statistics, and performance analytics.
FR-12: The system shall notify users of generation status, completion, and system alerts.
FR-13: The system shall handle asynchronous AI processing using background task execution mechanisms.
FR-14: The system shall log user activities and generation requests for monitoring and auditing purposes.
FR-15: The system shall allow administrators to manage users, roles, permissions, and system configurations.
Functional Requirement or Feature:
Each functional requirement of the GenMark system corresponds to one or more system features and associated use cases. The system supports end-to-end generative marketing workflows by integrating project management, brand kit handling, AI-based content generation, asset storage, and analytics within a unified platform. Functional requirements are realized through direct user interactions, automated background processing, and AI-driven generation and validation mechanisms.
These features collectively ensure that GenMark not only assists users in creating marketing content but also enhances creative efficiency, maintains brand consistency, and provides actionable insights to support data-driven marketing decisions.
Use Case Model
The Use Case Model describes how different actors interact with the GenMark system to achieve specific goals. It provides a visual and textual representation of system behavior from the user’s perspective.
Use Case 01: Authentication And Authorization
Use-Case Description:
Table SEQ Table \* ARABIC 5: Authentication
DEPENDENCIES
OBJ-001 User Login
OBJ-002 Credential Validation
OBJ-003 Role-Based Authorization
DESCRIPTION
This module is responsible for managing secure access to the GenMark system. The module enforces authentication, authorization, and session management to protect user data and brand assets.
ACTORS
User, System
PRE-CONDITION
The system must be online and the user must be registered in the system.
ORDINARY SEQUENCE
STEP
ACTION
01
User opens the GenMark login page
02
User enters email and password
03
System validates entered credentials
04
System verifies user assigned role
05
System grants access accordingly
POST-
CONDITION
User is successfully authenticated and redirected to the respective dashboard.
EXCEPTIONS
Invalid credentials, unauthorized role access, account suspension, expired session, system validation failure.
COMMENTS
Multi-factor authentication (MFA) can be implemented to enhance system security. Failed login attempts should be logged for monitoring and auditing purposes.
Use Case 02: User Registration
Use Case Description
Table SEQ Table \* ARABIC 6: User Registration
DEPENDENCIES
OBJ-004 User Account Creation
OBJ-005 Input Validation
DESCRIPTION
This use case allows a new user to create an account in the GenMark system by providing required registration information. The system validates the input data and creates a new user profile with default access permissions.
ACTORS
User, System
PRE-CONDITION
The system must be online, and the user must not already be registered.
ORDINARY SEQUENCE
STEP
ACTION
01
User opens the GenMark registration page
02
User enters required registration details
03
System validates the entered information
04
System creates a new user account
05
System confirms successful registration
POST-
CONDITION
A new user account is created, and the user can proceed to log in..
EXCEPTIONS
Duplicate account, invalid input data, weak password, or system failure.
COMMENTS
Password complexity rules and email verification can be implemented to enhance account security.
Use Case-03: Create Project
Use Case Description
Table SEQ Table \* ARABIC 7: Create project
DEPENDENCIES
OBJ-006 Project Management
OBJ-007 Input Validation
DESCRIPTION
This use case enables users to create a new marketing project within GenMark. Each project serves as a container for brand kits, generated content, and related assets.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and logged into the system.
ORDINARY SEQUENCE
STEP
ACTION
01
User selects “Create Project”
02
User enters project details
03
System validates project information
04
System creates the project
05
System displays project dashboard
POST-
CONDITION
A new project is successfully created and available for use.
EXCEPTIONS
Invalid project data, duplicate project name, or system error.
COMMENTS
Brand Kits can be updated and reused across multiple campaigns.
Use Case-04: Create Brand Kit
Use Case Description
Table SEQ Table \* ARABIC 8:Create brand Kit
DEPENDENCIES
OBJ-008 Brand Kit Management
OBJ- 009 Asset Upload
DESCRIPTION
This use case allows users to define a Brand Kit for a project by uploading logos, selecting colors and fonts, and defining brand guidelines to ensure consistent content generation.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and a project must already exist.
ORDINARY SEQUENCE
STEP
ACTION
01
User selects “Create Brand Kit”
02
User uploads brand assets
03
User defines brand colours and fonts
04
System validates brand data
05
System saves the Brand Kit
POST-
CONDITION
A Brand Kit is successfully created and associated with the project.
EXCEPTIONS
Unsupported file format, incomplete brand data, or upload failure.
COMMENTS
Preview functionality improves usability and reduces unnecessary downloads.
Use Case-05: Generate Image Form Text
Use Case Description
Table SEQ Table \* ARABIC 9: Generate Image form Text
DEPENDENCIES
OBJ-010 Text Prompt Processing
OBJ-011 AI Image Generation
DESCRIPTION
This use case enables users to generate marketing images by providing textual prompts. The system uses AI models and applies brand constraints to produce visually consistent images.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and a project must be selected.
ORDINARY SEQUENCE
STEP
ACTION
01
User enters a text prompt
02
User submits generation request
03
System processes the prompt
04
AI generates the image
05
System displays the generated image
POST-
CONDITION
An AI-generated image is created and displayed to the user.
EXCEPTIONS
Invalid prompt, AI service failure, or generation timeout.
COMMENTS
Generated images may be edited, regenerated, or stored in the asset library.
Use Case-06: Generate Text Form Image
Use Case Description
Table SEQ Table \* ARABIC 10: generate text to Image
DEPENDENCIES
OBJ-012 Image Analysis
OBJ-013 AI Text Generation
DESCRIPTION
This use case allows users to upload an image and generate descriptive text, captions, or insights using AI-based image analysis.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and a project must be selected.
ORDINARY SEQUENCE
STEP
ACTION
01
User uploads an image
02
User requests text generation
03
System analyzes the image
04
AI generates textual output
05
System displays the generated text
POST-CONDITION
Textual content is generated from the uploaded image.
EXCEPTIONS
Unsupported image format, AI processing failure, or system timeout.
COMMENTS
Generated text can be edited, saved, or reused for marketing content.
Use Case-07: Preview Generated Content
Use Case Description
Table SEQ Table \* ARABIC 11: Preview Content
DEPENDENCIES
OBJ-014 Content Rendering
OBJ-015 Asset Retrieval
DESCRIPTION
This use case allows users to preview AI-generated images or text content before saving, editing, or downloading it. The preview helps users verify quality and brand alignment
ACTORS
User, System
PRE-CONDITION
User must be authenticated and generated content must exist.
ORDINARY SEQUENCE
STEP
ACTION
01
User selects generated content
02
System retrieves content
03
System displays preview
04
User reviews the content
POST-
CONDITION
The content is successfully previewed by the user.
EXCEPTIONS
Content retrieval failure or rendering error.
COMMENTS
Preview functionality improves usability and reduces unnecessary downloads.
Use Case-08: Edit Generated Content
Use Case Description
Table SEQ Table \* ARABIC 12 Edit Content
DEPENDENCIES
OBJ-016 Content Editing
OBJ-017 Brand Validation
DESCRIPTION
This use case allows users to edit generated images or text to better match campaign requirements while maintaining brand consistency.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and content must be previewed.
ORDINARY SEQUENCE
STEP
ACTION
01
User selects edit option
02
System opens editor
03
User modifies content
04
System validates updates
05
System saves changes
POST-
CONDITION
Edited content is saved successfully.
EXCEPTIONS
Invalid edits, brand rule violation, or save failure.
COMMENTS
Editing tools may include text adjustment, cropping, or style refinement.
Use Case-09: Download/Export Content
Use Case Description
Table SEQ Table \* ARABIC 13: Download export
DEPENDENCIES
OBJ-018 File Export
OBJ-019 Format Conversion
DESCRIPTION
This use case allows users to download or export generated content in supported formats for external use.
ACTORS
User, System
PRE-CONDITION
User must be authenticated and content must exist.
ORDINARY SEQUENCE
STEP
ACTION
01
User selects download option
02
User selects format
03
System prepares file
04
System initiates download
POST-
CONDITION
Content is successfully downloaded by the user.
EXCEPTIONS
Unsupported format or export failure.
COMMENTS
Multiple export formats improve platform flexibility.
Use Case-10: Asset Library Management
Use Case Description
Table SEQ Table \* ARABIC 14: Asset library Management
DEPENDENCIES
OBJ-020 Asset Storage
OBJ-021 Search &amp; Filter
DESCRIPTION
This use case enables users to store, search, organize, and reuse generated content and uploaded assets across projects.
ACTORS
User, System
PRE-CONDITION
User must be authenticated
ORDINARY SEQUENCE
STEP
ACTION
01
User opens asset library
02
System displays stored assets
03
User searches or filters assets
04
User selects asset for reuse
POST-
CONDITION
Assets are successfully accessed or reused.
EXCEPTIONS
Asset not found or retrieval failure.
COMMENTS
Centralized storage improves content reuse and productivity.
Use Case-11: Veiw DashBoard And Analytics
Use Case Diagram
Use Case Description
Table SEQ Table \* ARABIC 15:View Download and Analytics
DEPENDENCIES
OBJ-020 Analytics Processing
OBJ-021 Usage Monitoring
DESCRIPTION
This use case allows users to view dashboards showing content generation history, usage statistics, and performance insights.
ACTORS
User, System
PRE-CONDITION
User must be authenticated
ORDINARY SEQUENCE
STEP
ACTION
01
User opens dashboard
02
System retrieves analytics data
03
System displays visual charts
04
User reviews insights
POST-
CONDITION
Analytics information is successfully displayed.
EXCEPTIONS
Data retrieval failure or visualization error.
COMMENTS
Dashboards support data-driven marketing decisions.
Use Case-12: Manage Users and Roles
Use Case Description
Table SEQ Table \* ARABIC 16 manage User and Roles
DEPENDENCIES
OBJ-022 User Management
OBJ-023 Role Configuration
DESCRIPTION
This use case allows administrators to manage user accounts, assign roles, and configure permissions within the GenMark system.
ACTORS
User, System
PRE-CONDITION
Administrator must be authenticated with admin privileges.
ORDINARY SEQUENCE
STEP
ACTION
01
Admin opens user management panel
02
Admin selects user account
03
Admin assigns or updates role
04
System saves configuration
POST-
CONDITION
User roles and permissions are updated successfully.
EXCEPTIONS
Unauthorized access, invalid role assignment, or system error.
COMMENTS
Role management ensures system security and controlled access.
Use Case 013– Full System
Use-Case Description:
Table SEQ Table \* ARABIC 17 Full System Integration
DESCRIPTION
This use case represents the complete end-to-end lifecycle of content creation and brand management within the GenMark system.
ACTORS
User (Marketer/Designer), AI Engine, Admin, External AI Services
PRE-CONDITION
Users are registered and authenticated, brand kits are configured, and AI services are available and properly integrated.
ORDINARY SEQUENCE
STEP
ACTION
01
User logs into system
02
User creates or selects a project
03
User uploads or configures a brand kit
04
User selects content type (text-to-image, image-to-text, etc.)
05
AI engine processes input based on brand guidelines
06
Generated content is displayed to the user
07
User reviews, edits, or regenerates content
08
Final content is saved, exported, or published
POST-
CONDITION
Project is completed efficiently with useful content
EXCEPTIONS
AI service.
COMMENTS
This master use case consolidates all IntelliPM functionalities into a single coherent workflow.
Other Non-Functional Requirements
This section outlines the various non-functional aspects of the GenMark system. The information provided here defines the system’s performance expectations, quality attributes, and operational constraints. It also includes security requirements that ensure GenMark remains a secure, reliable, and responsive platform for all users during normal operation as well as under peak usage conditions.
Performance Requirements
The GenMark system shall satisfy the following performance requirements to provide a responsive and efficient user experience:
The system shall support multiple concurrent users without significant degradation in performance.
User authentication and authorization requests shall be processed within an acceptable time frame under normal operating conditions.
AI-based content generation and image analysis activities shall complete within a reasonable time depending on request complexity and system load.
The system shall maintain acceptable performance levels during peak usage periods.
The system shall provide timely updates to dashboards and content generation status based on the most recent user actions.
These performance requirements ensure that users experience minimal delays while interacting with the GenMark platform.
Safety and Security Requirements
The GenMark system shall implement a range of safety and security measures to protect user data, brand assets, and system resources from unauthorized access and potential threats.
Users shall be required to verify their identity through secure authentication mechanisms before accessing the system.
The system shall enforce Role-Based Access Control (RBAC) to ensure users can only perform actions permitted by their assigned roles.
Passwords and other sensitive information shall be securely encrypted or hashed to maintain data confidentiality.
User sessions shall automatically expire after a predefined period of inactivity to prevent unauthorized access.
All security-related events, including login attempts and access violations, shall be logged for monitoring and auditing purposes.
Input validation mechanisms shall be implemented to protect the system from common security threats such as unauthorized access, data manipulation, and injection attacks.
These security requirements contribute to maintaining the confidentiality, integrity, and availability of the GenMark system and its associated user and content data.
Software Quality Attributes
The GenMark system shall exhibit the following software quality attributes:
Usability: The system shall provide a user-friendly and intuitive interface that requires minimal training for effective use.
Reliability: The system shall operate consistently with minimal downtime and dependable performance.
Scalability: The system shall be capable of handling an increasing number of users, projects, and generated content over time.
Maintainability: The system shall be modular, well-documented, and structured to support future enhancements and updates.
Availability: The system shall be accessible to authorized users whenever required, subject to scheduled maintenance.
Portability: The system shall be usable across different devices and modern web browsers without functional limitations.
These quality attributes ensure that GenMark remains effective, adaptable, and sustainable throughout its operational lifecycle.
Design Requirements:
High Level Design:
Abstract design/Block Diagram:
Figure 1 Block Diagram
333382597150Design oblige Architecture Patterns
Figure SEQ Figure \* ARABIC 2 oblige Diagram
Structural Design
Class Diagram
Figure SEQ Figure \* ARABIC 3: GenMark Class Diagram
Component Diagram
Figure SEQ Figure \* ARABIC 4: Component Diagram-GenMark
DFD
Level 0
Figure SEQ Figure \* ARABIC 5: Data Flow Diagram-Level 0
Level 1
Figure SEQ Figure \* ARABIC 6: Data Flow Diagram-Level 1
Level 2
Figure SEQ Figure \* ARABIC 7: Data Flow Diagram-Level 2a
Figure 07: Data Flow Diagram-Level 2b
Behavioral Design
Use Case Diagram
Figure 08: GenMark-Use Case
Sequence Diagrams
Text to Image
Figure 08:Text To Image-Sequence Diagram
Text To Text:
Figure SEQ Figure \* ARABIC 9: Activity Diagram-User Login
Image To Text
Figure SEQ Figure \* ARABIC 10: Activity Diagram-User Login
Activity Diagrams
User Login
Figure SEQ Figure \* ARABIC 11: Activity Diagram-User Login
Text To Image:
Figure SEQ Figure \* ARABIC 12: Activity Diagram-Text To Image
Image to Text
Figure SEQ Figure \* ARABIC 13:Activity Diagram-Image to text
Brand Kit Management
Figure SEQ Figure \* ARABIC 14: Activity Diagram-Brand kit Management
5.3.4. ProtoType
5.3.4.1. Landing Page [Home]
5.3.4.2. About
5.3.4.3. Features
5.3.4.4. Pricing
5.3.4.5. Documents
5.3.4.6 . Sign In Page
5.3.4.7. Dashboard
Data Design and Relationships
Database Schema
Entity Relationship Diagram
Figure 15: ERD-GenMark
Data Dictionary
Figure SEQ Figure \* ARABIC 16 Data Dictionary
Software Planning and Timeline
This section describes the planning approach and development timeline for the GenMark project. It outlines how project activities are structured and scheduled, identifies major milestones and deliverables, and presents the baseline timeline used to monitor progress throughout the software development lifecycle.
Work Breakdown Structure
The Work Breakdown Structure (WBS) decomposes the GenMark project into manageable phases and tasks. It provides a hierarchical view of the work required to successfully complete the system and ensures clear responsibility assignment and progress tracking.
Figure 17 WBS
Milestones and Deliverables
The GenMark project is planned around key milestones, each associated with specific deliverables to measure progress and completion.
Table SEQ Table \* ARABIC 18:Milestone &amp; Deliverables
Milestone
Description
Deliverables
Date
Proposal Approval
Formal approval of project idea
Approved proposal document
29 October2025
Requirements Finalization
Completion of requirement analysis
SRS document
05 November 2025
Design Completion
Finalization of system and database design
UML diagrams, ERD, architecture
21 January 2026
Implementation Phase
Development of core system features
Working system modules
21-March 2026
Testing Completion
Verification and validation of system
Test cases, test reports
24-April 2026
Deployment
System ready for use
Deployed application
26 May 2026
Final Submission
Completion of academic requirements
Final report and presentation
31 June 2026
Detailed Baseline Plan
Quality Assurance Plan
This section defines the quality assurance strategy for the GenMark system. It outlines the testing requirements, acceptance criteria, and planned testing activities to ensure that the system meets specified requirements, performs reliably, and delivers high-quality functionality throughout its lifecycle.
Testing Requirements
All components of the GenMark system shall undergo systematic testing, including functional, performance, and security validation and verification. Testing activities will be integrated early into the development lifecycle to identify defects at an early stage and ensure compliance with defined requirements. The identified testing requirements include:
Unit testing of individual modules such as authentication, project management, brand kit handling, and AI content generation components.
Integration testing to verify correct interaction between frontend, backend, AI services, and storage modules.
System testing to validate complete end-to-end functionality of the GenMark platform.
Scenario-based testing to evaluate real-world usage cases and user workflows.
Performance testing to assess system responsiveness and stability under varying load conditions.
Security testing to ensure user data, brand assets, and generated content are protected and accessible only to authorized users.
User acceptance testing (UAT) to evaluate usability, functionality, and overall user experience.
All identified defects shall be documented, tracked, and resolved prior to final deployment.
Acceptance Criteria
GenMark will be approved for deployment when the following conditions are satisfied:
All functional requirements defined in the Software Requirements Specification (SRS) have been fully implemented and verified.
All high-severity and critical defects identified during testing have been resolved.
System functionalities operate correctly and reliably under both normal and peak usage conditions.
Role-based access control mechanisms are correctly enforced across all system features.
AI-generated content is relevant, accurate, and consistent with user input and defined brand constraints.
All planned test cases have been successfully executed and passed.
The GenMark system shall be considered approved for deployment and final submission upon formal acceptance by project stakeholders and supervising academic faculty.
Planned Test Suite and Test Cases
Test Cases
TS 01: USER REGISTRATION (SIGNUP)
Table SEQ Table \* ARABIC 19:User Registration
Scenario ID
Test Scenario
Test Steps
Expected Result
TC-SIGN-01
Successful signup
Open signup → enter valid name, email, password → submit
Account created, redirected to login
TC-SIGN-02
Email already registered
Enter previously used email → submit
“Email already exists” error
TC-SIGN-03
Password mismatch
Enter different password &amp; confirm password
“Passwords do not match” error
TC-SIGN-04
Invalid email format
Enter invalid email (missing @ or domain)
“Invalid email format” error
TC-SIGN-05
Blank fields
Submit without entering any data
“Required field missing” error
TC-SIGN-06
Weak password
Enter password below security criteria
“Password too weak” error
TC-SIGN-07
Network failure
Disable internet → submit form
Network error message
TS 02: Authentication &amp; Authorization (Login)
Table SEQ Table \* ARABIC 20 TS 02: Authentication &amp; Authorization
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-LOGIN-01
Successful login
Verify user is Login with valid data
Login page loaded
Enter valid name, email, password → Submit
redirected to Dashboard
TC- LOGIN -02
Invalid password
Prevent entering wrong password
Login page loaded
Enter invalid password → Submit
Error “Invalid password”
TC- LOGIN -03
Unregistered user
Validate user registration
Login page loaded
Enter unregistered email → Submit
Error “User Not Found”
TC- LOGIN -04
Empty credentials
Verify login with correct credentials
Login page loaded
Empty fields → Submit
Error “Fill the form”
TC- LOGIN -05
Session timeout
Stay idle for long time
Login Page loaded
Stay idle beyond limit
Auto logout
TC-LOGIN-
06
Role enforcement
Using Privileges
Login page Loaded
Login as User/Admin
Correct dashboard displayed
TS 03: Project Creation
Table SEQ Table \* ARABIC 21: Project Creation
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-PROJ-01
Create Project
Creating a project
User logged in
Click create → enter valid data → save
Project created
TC-PROJ-02
Duplicate Project Name
Using pervious project name
Project exists
Click create →Enter Duplicate project name →save
error “Duplicate name”
TC-PROJ-03
Missing Project name
Remove project
User clicked Create
Submit empty name
Validation error
TC-PROJ-04
Edit project
Editing a project
Project exists
Update project details
Project Updated
TC-PROJ-05
Deleting a project
Remove unwanted project
Project Exists
Edit project
Project Deleted
TS 04: Brand Kit Management
Table SEQ Table \* ARABIC 22: Brand kit management
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-BRAND-01
Create Brand Kit
Creation Of Brand kit
User Logged in
Upload logo, colors, fonts
Brand Kit Saved
TC- BRAND -02
Missing assets
Not upload assets
User Logged in
Skip required brand data
Validation error
TC- BRAND -03
Invalid File Format
Uploaded in Wrong Format
User Logging in
Upload unsupported file
Format error
TC- BRAND -04
Update Brand kit
Updating a Brand kit
Brand Kit exists
Modify Colors, Fonts
Updated Brand Kit
TC-BRAND-05
Apply Brand Kit
Applying a Brand Kit
Prompted is Entered
Select brand kit for project
Brand kit applied
TS 05: Text To Image Generation
Table SEQ Table \* ARABIC 23 Text To Text Generation
Test Case ID
Test Case
Name
Description
Preconditions
Test Steps
Expected Results
TC-T2I-01
Generate image
Generating a image using AI
User Logged in
Enter prompt → generate
Image Displayed
TC-T2I-02
Empty prompt
No Prompt Entered
User Logged In
Submit blank prompt
Error “Enter a Prompt”
TC-T2I-03
Brand constraint applied
Validating brand Consistency
Brand kit exists
Generate with brand kit
Brand-consistent image
TC-T2I-04
AI service failure
AI has a service failure
User Click generate
Simulate AI downtime
Error message
TC-T2I-05
Regenerate image
Regenerating an image
Pervious image generated
Click regenerate
New image generated
TS 06: Image To Text Generation
Table SEQ Table \* ARABIC 24 Image To Text Generation
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-I2T -01
Generate Text
Generating captions, etc
User Logged in
Upload image → generate
Text Displayed
TC-I2T-02
Invalid image
Uploading an Invalid image
User logged in
Upload unsupported format
Format Error
TC-RISK-03
Large image
Uploading a Large Image
Format is correct
Upload large image
Handled successfully
TC-T2I-04
AI service failure
AI has a service failure
User Click generate
Simulate AI downtime
Error message
TC-RISK-05
Save Generated text
Save AI generated Image
Already generated Text
Click Save
Saved Successfully
TS 07: Assets Library Management
Table SEQ Table \* ARABIC 25 Assets Library Management
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-ASSET-01
Store Asset
Storing a Assets
Project exists
Save generated content
Asset saved
TC- ASSET-02
Search Asset
Searching a asset
Asset exists
Enter keyword
Matching assets shown
TC- ASSET-03
Filter Asset
Create project report
Asset exists
Apply Filter
Filtered Results
TC- ASSET -04
Reuse Asset
Export report
Asset exists
Select asset → reuse
Asset reused
TC- ASSET-05
Delete Asset
Restrict reports
Asset exists
Delete selected asset
Asset removed
TS 08: Dashboard And Analytics
Table SEQ Table \* ARABIC 26: Dashboard &amp; Analytics
Scenario ID
Test Scenario
Test Steps
Expected Result
TC-DASH-01
View dashboard
Open dashboard
Data displayed
TC- DASH -02
Update analytics
Generate content
Stats updated
TC- DASH -03
No data
New user dashboard
Empty state shown
TC- DASH -04
Performance under load
Multiple requests
Stable response
TS 09: Full System Integration
Table SEQ Table \* ARABIC 27: Full System Integration
Test Case ID
Test Case Name
Description
Preconditions
Test Steps
Expected Results
TC-INT-01
End-to-End Flow
Signup →
Project
System running
Complete workflow
Successful execution
TC-INT-02
Authentication Integration
Validate module sync
Valid user credentials
Login → Access all modules
Login → Access all modules
TC-INT-03
Brand Kit Integration
Verify brand kit applies to AI generation
Project &amp; brand kit exist
Generate image using brand kit
Brand-consistent output
TC-INT-04
Text-to-Image Integration
Verify frontend, backend, AI interaction
User logged in
Submit text prompt
Image generated and displayed
TC-INT-05
Image-to-Text Integration
Verify image analysis pipeline
Image uploaded
Generate text from image
Accurate text generated
TC-INT-06
Asset Library Integration
Verify generated content storage
Content generated
Save content → Open asset library
Content stored and retrievable
TC-INT-07
Dashboard Integration
Verify analytics update
Previous activities performed
Open dashboard
Updated usage statistics shown
TC-INT-08
Dashboard Integration
Verify analytics update
Simulated failure
Trigger AI or network error
Proper error message shown
Test Suite
Table SEQ Table \* ARABIC 28 Test Suites
Test Suite ID
Test Suite Name
Module Covered
Description
Test Cases Included
Entry Criteria
Exit Criteria
TS-01
User Registration &amp; Authentication
Authentication Module
Validates user signup, login, logout, and credential validation
TC-SIGN-01 to TC-SIGN-07
System deployed, DB connected
All auth test cases pass
TS-02
Authorization &amp; RBAC
Security Module
Verifies role-based access for Admin, Manager, and User
TC-RBAC-01 to TC-RBAC-05
Successful login
Role permissions enforced
TS-03
Project Management
Project Module
Tests project creation, update, deletion, and settings
TC-PROJ-01 to TC-PROJ-06
User authenticated
Projects handled correctly
TS-04
Brand Kit Management
Brand Kit Module
Validates creation, update, and usage of brand kits
TC-BRAND-01 to TC-BRAND-06
Project exists
Brand kits saved and applied
TS-05
Text-to-Image Generation
AI Generation Module
Verifies AI image generation from text prompts
TC-T2I-01 to TC-T2I-07
Brand kit configured
Images generated correctly
TS-06
Image-to-Text Generation
AI Analysis Module
Tests extraction of text from images
TC-I2T-01 to TC-I2T-06
Image uploaded
Accurate text output
TS-07
Asset Library Management
Storage Module
Tests saving, viewing, deleting generated assets
TC-ASSET-01 to TC-ASSET-05
Content generated
Assets stored correctly
TS-08
Dashboard &amp; Analytics
Analytics Module
Verifies dashboard data, KPIs, and reports
TC-DASH-01 to TC-DASH-05
User activity available
Analytics updated
TS-09
Full System Integration
Integrated System
Validates end-to-end workflow across all modules
TC-INT-01 to TC-INT-10
All modules tested
System stable &amp; functional
Configuration Management Plan:
Scope And Reference
Scope
The scope of the GenMark Configuration Management Plan (CMP) is defined in accordance with IEEE Std 828-1983 and is specifically tailored for an academic Final Year Project focused on Generative AI–based marketing content creation. This CMP establishes a controlled and traceable framework for managing configuration items, versions, and changes throughout the complete software lifecycle of GenMark.
Applicability Across Software Lifecycle
This CMP applies to all lifecycle phases of GenMark, including:
Requirements analysis
System and AI model design
Frontend and backend development
AI model integration and inference
Testing and validation
Cloud deployment
Maintenance and enhancement
Since GenMark generates brand-sensitive marketing visuals using AI, maintaining version integrity, brand rules, model consistency, and deployment stability is critical.
Identification of Software Product Items
This CMP governs all configuration items related to GenMark, including but not limited to:
Web application frontend (React.js UI components)
Backend services and APIs (Django-based services)
AI generation modules (text-to-image and image-to-image pipelines)
Prompt processing and brand-governance logic
Databases (PostgreSQL and MongoDB schemas)
Model configuration files and inference parameters
Deployment and environment configuration files
Documentation (SRS, SDS, CMP, user guides, project reports)
Integrated third-party AI APIs and libraries
Change Control and Implementation
The CMP defines a formal change management process for GenMark that includes:
Submitting change requests
Reviewing technical and business impact
Approving or rejecting changes
Controlled implementation and testing
Validation before deployment
All changes are evaluated for their impact on AI output quality, brand consistency, system performance, security, and user experience.
Recording and Reporting Status
Configuration status accounting is maintained using version control and repository management tools, ensuring:
Complete traceability of code, AI models, and documents
Clear tracking of approved and pending changes
Visibility into current system baselines
Compliance with Standards
This CMP complies with:
IEEE Std 828-1983 (SCM Plans)
IEEE Std 729-1983 (Software Engineering Terminology)
IEEE best practices suitable for academic AI-driven software projects
Risk and AI Integrity Considerations
Because GenMark relies on Generative AI models, special focus is placed on:
AI model version control
Prompt and output consistency
Safe rollback in case of faulty deployments
Preventing off-brand or unstable AI outputs
Flexibility and Adaptability
This CMP is designed to adapt as GenMark evolves, allowing:
Addition of new AI models
Integration of new marketing features
Refinement of brand governance rules
References
IEEE Std 729-1983 – Software Engineering Terminology
IEEE Std 828-1983 – Software Configuration Management Plans
IEEE Std 730 – Software Quality Assurance
SWEBOK Guide
Definitions and Acronyms
Definitions
The following definitions apply to GenMark and are aligned with IEEE standards:
Baseline: A formally approved version of GenMark’s source code, AI model configuration, or documentation that serves as a reference point for future development.
Configuration Item (CI): Any identifiable component of GenMark such as frontend code, backend APIs, AI model configurations, databases, documentation, or deployment scripts that is managed under SCM.
Configuration Management: The discipline of maintaining integrity, traceability, and consistency of GenMark’s software artifacts and AI components throughout the project lifecycle.
Configuration Control: A structured process used to evaluate, approve, or reject changes to GenMark configuration items.
Configuration Control Board (CCB): A designated group consisting of project team members responsible for approving significant changes affecting GenMark’s functionality, AI behavior, or deployment.
Configuration Audit: A verification process to ensure GenMark’s configuration items conform to approved baselines and documented requirements.
Configuration Identification: The process of uniquely labeling and documenting GenMark configuration items and their relationships.
Configuration Status Accounting: Recording and reporting the current state, history, and approval status of all GenMark configuration items.
Interface Control; Management of interactions between GenMark components such as frontend-backend APIs, AI services, databases, and third-party AI providers.
Acronyms
CCB-Configuration Control Board
SCM - Software Configuration Management
SCMP - Software Configuration Management Plan
CI - Configuration Item
IEEE - Institute of Electrical and Electronics Engineers
API - Application Programming Interface
AI - Artificial Intelligence
CI/CD - Continuous Integration / Continuous Deployment
Software Configuration Management Plan
Introduction
This Configuration Management Plan defines the framework used to manage configuration activities for the GenMark AI-based marketing content creation platform.
It ensures controlled evolution of GenMark’s codebase, AI models, and documentation while maintaining consistency, traceability, and quality.
Purpose
The purpose of this CMP is to:
Ensure reliable and consistent AI-generated marketing content
Control changes affecting AI output, branding rules, and system behaviour
Minimize defects during rapid AI feature iteration
Support deployment, maintenance, and future enhancements
Scope
This CMP applies to:
Software Items
Web frontend (React.js)
Backend services and APIs (Flask)
AI inference pipelines
Databases and storage (Mango DB)
Deployment configurations
Project documentation
Third-party AI libraries
Organizations
Development Team
Quality Assurance (within project team)
Operations &amp; Deployment Team
Project Management
Activities
AI feature development and integration
Testing and validation
Deployment and updates
Change tracking and monitoring
Lifecycle Phases
Planning and requirements
Design and development
Testing and validation
Deployment
Maintenance and enhancement
Definitions and Acronyms
All definitions and acronyms are provided in Section 9.2.
References
IEEE Std 828-1983 – Software Configuration Management Plans
IEEE Std 729-1983 – Software Engineering Terminology
Management
Organization
The GenMark SCM structure ensures accurate tracking and control of all configuration items
Org Chart:
Table SEQ Table \* ARABIC 29 SCM Organization
Team
Responsibilities
Development Team
Implement frontend, backend, AI logic, testing, and documentation
SCM Team
Track configuration items, manage versions, maintain baselines
QA Team
Validate functionality, AI output consistency, and compliance
Operations Team
Deploy GenMark, manage updates and rollback
Project Management
Approve major changes, manage risks and progress
SCM Responsibilities
Table SEQ Table \* ARABIC 30 SCM Responsibilities
Role
Responsibilities
SCM Lead
Define CIs, manage repositories, establish baselines
Developers
Implement approved changes, follow branching and commit rules
QA Team
Perform verification, audits, and validation
Project Management
Approve major configuration changes
Interface Control
Interface control in GenMark focuses on AI pipelines and web service integration.
a) Identification of Interface Specifications
All interfaces such as UI components, backend APIs, AI inference services, and external AI providers are documented.
Interface contracts define data formats, prompt structures, and response handling.
b) Processing Interface Changes
Changes to APIs or AI interfaces follow formal change control.
Impact on AI output quality and frontend behaviour is evaluated.
c) Follow-up on CM Action Items
Interface-related updates (API changes, prompt logic updates) are tracked to completion.
d) Maintaining Interface Status
Version history and ownership of all interfaces are maintained.
Regular reports ensure visibility.
e) Software–Hardware Interface Control
GenMark ensures compatibility across browsers and cloud infrastructure.
Continuous testing ensures stability after platform or environment changes.
SCMP Implementation
Table SEQ Table \* ARABIC 31 SCMP Implementation
Milestone
Explanation
Objective
Timeline
Establish Configuration Control Board (CCB)
Form a CCB consisting of members from Development, QA, AI Integration, deployment, and Project Management to evaluate and approve configuration changes related to GenMark.
Ensure controlled, consistent, and authorized changes across AI models, branding rules, and system components.
Project initiation phase
Establish Baselines
Define and approve Functional, Allocated, and Product baselines for GenMark covering requirements, system design, AI pipelines, and releases
Provide stable reference points for controlled AI and software evolution.
Requirements and design phases
Schedule Reviews and Audits
Conduct configuration reviews and audits at major milestones, AI model updates, and production releases.
Ensure compliance with baselines, quality standards, and brand consistency rules.
At major milestones and post-release
Manage SCM Tools
Identify and manage development, AI, and deployment tools (GitHub, cloud services, AI APIs) to ensure traceability and consistency.
Support reliable SCM operations throughout the GenMark lifecycle.
Throughout project lifecycle
Policies, Directives, and Procedures
a) Identification of Applicable SCM Policies, Directives, and Procedures
The following SCM policies apply to GenMark:
Hierarchical Software Levels
GenMark components are organized hierarchically as:
System level (GenMark platform)
Subsystems (Frontend UI, Backend APIs, AI Generation Services)
Modules (Prompt processor, brand governance engine, image generator)
This structure enables precise impact analysis of changes.
Naming Conventions
Standard naming rules are enforced for:
Source code modules
AI pipelines and configurations
Documentation
Deployment artifacts
This ensures consistency and easy traceability.
Version Level Designations
GenMark follows semantic versioning (Major.Minor.Patch):
Major: Architectural or AI model changes
Minor: Feature enhancements
Patch: Bug fixes and optimizations
Software Product Identification
Each GenMark release, build, and AI model configuration is uniquely identified to ensure reproducibility and rollback capability.
Document Management
Formal procedures govern creation, update, review, and approval of:
SRS
Design specifications
AI documentation
Test reports
User manuals
Media and Repository Management
Digital repositories are centrally managed to prevent data loss, duplication, or unauthorized access.
Document Release Process
All GenMark documentation is released through a controlled approval workflow ensuring consistency and accuracy.
Software Product Turnover
Only approved and tested GenMark builds are transferred to deployment environments.
Problem Report Processing
Defects, enhancement requests, and AI behaviour issues are logged, reviewed, approved, and resolved through a formal SCM workflow.
b) SCM Policies, Directives, and Procedures to be Developed
The following GenMark SCM materials will be developed:
CCB Operating Procedures for AI and branding-related changes
Software Release and Acceptance Criteria ensuring AI output quality and brand alignment
Software Library Operations for managing code, AI configs, and deployment packages
SCM Auditing Procedures for AI pipelines and system components
Change Documentation Standards including AI impact analysis and testing evidence
Quality Assurance Thresholds for AI-generated marketing visuals before release
SCM Activities
SCM activities for GenMark include:
Configuration Identification
Configuration Control
Configuration Status Accounting
Audits and Reviews
Configuration Identification
Identification of Software Project Baselines
Table SEQ Table \* ARABIC 32 Identification of SPB
Baseline
Items Forming Baseline
Review &amp; Approval
Acceptance Criteria
Participation
Functional
SRS, user stories, UI wireframes
Requirements review meetings
Completeness, clarity, testability
Stakeholders define needs, dev assess feasibility
Allocated
System design, AI pipelines, DB schema, API specs
Design reviews
Alignment with requirements
Devs finalize, QA validates
Product
Deployed web app, AI models, test results, manuals
Final review &amp; UAT
Correctness, usability, performance
Users test; team finalizes
b) Titling, Labelling, Numbering, and Cataloguing
Software Code
Modules include version identifiers and commit metadata
Structured repositories support impact analysis
Documentation
Documents include type, version, and release date
GitHub ensures history tracking and consistency
c) Additional Identification Considerations
Media Identification: All GenMark artifacts are uniquely labelled and tracked
Change Tracking: All changes are logged with rationale, approvals, and audit trails
Configuration Control
Authority for Change Approval
Table SEQ Table \* ARABIC 33 Authority for Change Approval
Phase
Approval Authority
Requirements
Project Manager
Design
Technical Lead &amp; QA Lead
implementation
Development Lead &amp; QA
Deployment
Deployment Lead
Maintenance
Project Manager &amp; Dev Lead
b) Processing Change Proposals
All GenMark change requests are:
Documented formally
Reviewed by the CCB
Assessed for AI output impact, brand compliance, cost, and risk
Implemented with full traceability
c) Software Library Control Procedures
GenMark maintains a secure, role-based software library:
Read/write permissions enforced
Baselines protected
Regular backups and recovery mechanisms implemented
d) Change Management Bodies
Configuration Control Board (CCB):
Table SEQ Table \* ARABIC 34: CCB
Attribute
Description
Role
Final authority for change approval
Chairperson
Project Manager
Members
Development, QA, AI, Deployment leads
Relationship
Collaborative with users and stakeholders
User Advisory Group (UAG):
Table SEQ Table \* ARABIC 35 UAG
Attribute
Description
Role
Provides marketing-focused user feedback
Purpose
Development, QA, AI, Deployment leads
Members
Marketers, content creators
e) Configuration Control of External Interfaces
All interfaces between GenMark and:
Cloud AI APIs
Storage services
Authentication systems
are fully documented, versioned, reviewed, and tested before deployment.
f) Control of Special Software Products
Non-released builds: Restricted to Dev &amp; QA
Third-party AI services: License and compatibility verified
In-house tools: Fully version-controlled and audited
Configuration Status Accounting
Configuration Status Accounting (CSA) ensures visibility of all GenMark configuration items.
Information Handling
Collection
Information related to configuration items is collected through the following sources:
Documented change request forms
Version control system logs (Git/GitHub)
Project progress updates from the development team
Manual reporting by developers and testers
Feedback received from users during testing and evaluation
Verification
Baseline comparison
Peer reviews
Supervisor checks
Storage
Secure cloud repositories
Controlled access
Automated backups
Processing
Status reports
Version histories
Audit trails
Reports Generated
Weekly SCM reports
Milestone release reports
Change implementation summaries
Audit reports
GenMark Status Tracking
AI model versions and inference settings
Prompt and brand governance logic
UI/UX versions (Figma)
Cloud deployment compatibility
Audits and Reviews
a) SCM Role in Audits
SCM coordinates:
Audit scheduling
CI availability
Stakeholder communication
Maintains:
Audit records
Findings and corrective actions
Configuration Items Covered
Table SEQ Table \* ARABIC 36 Configuration Items Covered
Phase
Items Reviewed
Requirements
SRS, traceability
Design
Architecture, AI workflows, UI designs
Development
Source code, builds
Testing
Test cases, results
Deployment
Release plans, manuals
c) Problem Identification and Resolution
Identification: Issue documented with impact
Investigation: Root-cause analysis
Corrective Action: Defined responsibilities and timeline
Verification: Re-testing and review
Closure: Formal approval and record update
Tools, Techniques, and Methodologies
Fig 19: UAG
Techniques and Methodologies
The following techniques and methodologies are applied to GenMark:
Modular and Component-Based Architecture: Separation of frontend, backend, AI services, and data layers to support scalability and maintainability.
Version Control and Baseline Management: Git-based branching, tagging, and release versioning to manage baselines and track changes.
Formal Change Control Process; Change requests documented, reviewed, approved, and implemented through the Configuration Control Board (CCB).
Incremental and Iterative Development; Agile-inspired iterations allowing continuous refinement of AI features, UI workflows, and performance.
AI-Specific Configuration Management: Controlled versioning of AI model configurations, prompt logic, and brand governance rules.
Record Collection and Retention
This section defines the procedures for collecting, safeguarding, and retaining Software Configuration Management (SCM) records for the GenMark project.
Identification of SCM Documentation to be Retained
The following SCM-related documentation for GenMark shall be retained:
Configuration Management Plan (CMP)
Change request forms and approval records
Source code repositories and version histories
Release notes and deployment records
Configuration audit and review reports
Meeting minutes related to configuration decisions
Test plans, test cases, and test results
UI/UX design artifacts created in Figma
AI model configuration and inference documentation
Methods and Facilities for Documentation Assembly, Safeguarding, and Maintenance
Documentation Assembly: All SCM documentation is systematically organized in a centralized digital repository structured by project phase and document type.
Safeguarding and Access Control: Access to SCM records is restricted to authorized GenMark project team members using role-based permissions.
Digital Storage: Electronic copies of all SCM documents and source code are stored securely using cloud-based platforms such as GitHub and institutional cloud storage.
Backup and Recovery: Regular automated backups are maintained through repository hosting services to protect against data loss and ensure recovery capability.
Designated Retention Period
SCM Documentation: Retained until completion of the GenMark project and final academic evaluation.
Audit and Review Reports: Retained until project grading and formal approval are finalized.
Version Control Records and Change Logs: Maintained throughout the project lifecycle and preserved until project completion for traceability and reference.