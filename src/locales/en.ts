export const en = {
  common: {
    back: "Back",
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    done: "Done",
    error: "Error",
    retry: "Retry",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    loading: "Loading...",
    noData: "No data available",
    completed: "Completed",
    reset: "Reset Lab",
    inviteTeacher: "Invite Teacher",
    lastActive: "Last active section",
    drop: "Drop",
    search: "Search experiments...",
    all: "All",
    startLab: "Start Experiment",
    syncing: "Syncing...",
    instruments: "Instruments",
    guide: "Experiment Guide",
    labName: "Physics Lab",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    markCompleted: "Mark as Completed",
    signupToStart: "Sign up to start",
    moreComingSoon: "More coming soon",
    comingSoonDesc: "We're building more interactive labs for you.",
    terminals: {
      positive: "positive",
      negative: "negative",
      terminal1: "terminal 1",
      terminal2: "terminal 2",
      input: "input",
      output: "output"
    }
  },
  nav: {
    home: "Home",
    experiments: "Experiments",
    labReports: "Lab Reports",
    dashboard: "Dashboard",
    templates: "Templates",
    docs: "Docs",
    openLab: "Open Lab",
    profile: "Profile",
    logOut: "Logout",
    signIn: "Sign In",
    signUp: "Sign Up",
    language: "Language",
    about: "About",
    contact: "Contact"
  },
  auth: {
    signin: {
      title: "Welcome Back",
      subtitle: "Continue your scientific journey",
      description: "Step into an interactive virtual laboratory.",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      button: "Sign In",
      buttonLoading: "Signing in...",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      signupLink: "Sign up now",
      google: "Continue with Google",
      or: "or",
      needAccount: "Don't have an account?",
      createOne: "Create one",
      sendingReset: "Sending reset link...",
      resending: "Resending...",
      resendEmail: "Resend verification email",
      messages: {
        signinSuccess: "Login successful! Redirecting...",
        resetSent: "Password reset link sent to your email.",
        resendSent: "Verification email resent successfully."
      },
      errors: {
        invalidEmail: "Please enter a valid email address",
        passwordRequired: "Password is required",
        passwordLength: "Password must be at least 8 characters",
        invalidCredentials: "Invalid email or password",
        generic: "Something went wrong. Please try again.",
        missingEmail: "Please enter your email address first.",
        forgotFail: "Failed to send reset link. Please try again.",
        resendFail: "Failed to resend verification link. Please try again."
      }
    },
    signup: {
      title: "Create Account",
      subtitle: "Join the future of STEM education",
      description: "Set up your workspace and start experimenting.",
      intent: "I want to...",
      createOrg: "Create New Organization",
      joinOrg: "Join Existing Organization",
      orgName: "Organization Name",
      orgPlaceholder: "Your School or Institute",
      fullName: "Full Name",
      fullNamePlaceholder: "John Doe",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      phone: "Phone Number",
      phonePlaceholder: "+1 (555) 000-0000",
      password: "Password",
      passwordHint: "Must be at least 8 characters",
      confirmPassword: "Confirm Password",
      role: "Your Role",
      rolePlaceholder: "Select your role",
      student: "Student",
      teacher: "Teacher",
      owner: "Administrator / School Head",
      button: "Create Account",
      buttonLoading: "Creating account...",
      orContinue: "Or continue with",
      google: "Sign up with Google",
      alreadyHave: "Already have an account?",
      signin: "Sign in",
      messages: {
        success: "Account created! Please check your email to verify."
      },
      errors: {
        nameRequired: "Name is required",
        nameMin: "Name must be at least 2 characters",
        nameMax: "Name must not exceed 60 characters",
        emailRequired: "Email is required",
        invalidEmail: "Please enter a valid email address",
        passwordMin: "Password must be at least 8 characters",
        passwordLength: "Password must be at least 8 characters",
        confirmPasswordLength: "Confirm password must be at least 8 characters",
        passwordMismatch: "Passwords do not match",
        signupFail: "Account creation failed. Please try again.",
        orgNameRequired: "Organization name is required to create a new one.",
        generic: "Something went wrong. Please try again."
      }
    }
  },
  onboarding: {
    title: "Onboarding",
    description: "Setting up your profile role.",
    finalizing: "Finalizing your account setup...",
    error: "Something went wrong during onboarding."
  },
  verifyEmail: {
    title: "Verify your email",
    description: "Paste the link from your inbox in this browser, or request another email if the original link expired.",
    verifying: "Hang tight, we’re confirming your verification link.",
    idle: "Open the verification email we sent and click on the included link.",
    loading: "Checking your verification token...",
    invalid: "Verification link is invalid.",
    success: "Email verified successfully. You can sign in now.",
    genericError: "Something went wrong while verifying the token.",
    continue: "Continue to sign in",
    resendTitle: "Need a fresh email?",
    resendSubtitle: "Enter your email address and we'll send another link.",
    resendPlaceholder: "you@example.com",
    resendButton: "Resend verification email",
    resendError: "Unable to resend verification email right now.",
    resendSuccess: "If that account exists, a new verification email is on the way.",
    resendGeneric: "Something went wrong. Please try again."
  },
  dashboard: {
    greeting: "Hello, {name}",
    welcome: "Continue your scientific journey",
    stats: {
      completedLabs: "Labs Completed",
      activeTime: "Active Time",
      hours: "hours",
      points: "Points",
      students: "Total Students",
      reports: "Total Reports",
      activeExps: "Active Labs"
    },
    students: {
      title: "Students",
      none: "No students yet. Add members above to get started.",
      unnamed: "Unnamed Student",
      view: "View"
    },
    reports: {
      title: "Recent Lab Reports",
      none: "No reports submitted yet.",
      by: "by"
    },
    hero: {
      tag: "Virtual Laboratory",
      title: "Explore the Laws of Physics",
      subtitle: "Interactive simulations that bring physics to life. Learn through experimentation, discovery, and play."
    },
    sections: {
      saved: "Saved Experiments",
      lastActive: "Last active section",
      recent: "Recently Viewed"
    },
    categories: {
      all: "All",
      electricity: "Electricity",
      mechanics: "Mechanics",
      optics: "Optics"
    },
    error: {
      load: "Failed to load dashboard data. Please refresh."
    },
    owner: "Owner",
    teacher: "Teacher",
    org: {
      createTitle: "Create Your Organization",
      createDesc: "You need an organization to manage students and labs.",
      namePlaceholder: "School Name",
      descPlaceholder: "Description (optional)",
      createButton: "Create Organization",
      cancel: "Cancel"
    },
    orgInfo: {
      addDesc: "Add students or other teachers to your organization.",
      add: "Add Member",
      inviteLink: "Copy Invite Link"
    }
  },
  gamification: {
    level: "Level",
    xp: "XP",
    nextLevel: "to next level",
    experiments: "experiments",
    badges: "Badges",
    scoreBreakdown: "Score Breakdown",
    expCompleted: "Experiments completed",
    obsRecorded: "Observations recorded"
  },
  experiments: {
    "ohm-law": {
      title: "Ohm's Law Verification",
      description: "Study the relationship between voltage, current, and resistance in a conductor.",
      category: "Electricity",
      difficulty: "Beginner"
    },
    "wheatstone-bridge": {
      title: "Wheatstone Bridge",
      description: "Learn to determine an unknown resistance using the bridge balance principle.",
      category: "Electricity",
      difficulty: "Intermediate"
    },
    "reflection-refraction": {
      title: "Reflection & Refraction",
      description: "Explore the laws of light as it interacts with mirrors and lenses.",
      category: "Optics",
      difficulty: "Intermediate"
    },
    "newton-second-law": {
      title: "Newton's Second Law",
      description: "Study force, mass, and acceleration using blocks and pulleys.",
      category: "Mechanics",
      difficulty: "Intermediate"
    },
    observation: "observation",
    observations: "observations"
  },
  guide: {
    tabs: {
      theory: "Theory",
      procedure: "Procedure",
      checklist: "Checklist",
      observation: "Observation",
      graph: "Graph",
      videos: "Videos",
      progress: "Progress"
    },
    ohm: {
      aim: "Aim",
      aimDesc: "To verify that the current (I) flowing through a conductor is directly proportional to the potential difference (V) across its ends.",
      concept: "Ohm's Law",
      conceptDesc: "At a constant temperature, the electric current flowing through a conductor is directly proportional to the potential difference across its ends.",
      steps: [
        "Connect the battery, key, resistor, ammeter, and rheostat in series.",
        "Connect the voltmeter in parallel with the resistor.",
        "Insert the key and set the rheostat for minimum current.",
        "Note the ammeter and voltmeter readings.",
        "Move the rheostat to different positions to take more readings.",
        "Plot a graph of V versus I."
      ]
    },
    wheatstone: {
      aim: "Aim",
      aimDesc: "To determine the value of an unknown resistance (S) using a Wheatstone bridge network.",
      principle: "Balance Condition",
      principleDesc: "When the bridge is balanced, no current flows through the galvanometer.",
      steps: [
        "Connect the four resistors P, Q, R, and S as shown in the diagram.",
        "Close key K1 and then close K2.",
        "Adjust resistance R such that the galvanometer shows zero deflection.",
        "Verify the relation P/Q = R/S in this state.",
        "Calculate the unknown resistance S = (Q/P) × R."
      ]
    },
    optics: {
      aim: "Reflection & Refraction",
      aimDesc: "Study the behavior of light rays as they interact with different optical media and surfaces.",
      lensFormula: "Lens Formula",
      lensFormulaDesc: "\"The relationship between object distance (u), image distance (v), and focal length (f) of a lens.\"",
      steps: [
        "Place a Light Source (Object) on the left side of the workspace.",
        "Place a Convex or Concave lens at the center.",
        "Adjust the object position and observe the ray paths.",
        "Measure the image distance (v) for various object distances (u).",
        "Verify the lens formula using the measured values."
      ]
    },
    mechanics: {
      aim: "Newton's Second Law",
      aimDesc: "Study the relationship between an object's mass, its acceleration, and the applied force.",
      forceEquation: "Force Equation",
      forceEquationDesc: "\"The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force and inversely proportional to the mass of the object.\"",
      steps: [
        "Setup a pulley at the edge or center of the workspace.",
        "Connect two blocks (M1 and M2) to the pulley system.",
        "Vary the masses of the blocks.",
        "Observe the acceleration and tension in the system.",
        "Analyze the results using Newton's laws of motion."
      ]
    },
    graph: {
      title: "V-I Characteristics",
      readings: "Live Readings",
      ohmLawOnly: "Graphs currently available for Ohm's Law.",
      notApplicable: "Graph not applicable for this experiment",
      minReadings: "Take at least two observations to see the graph.",
      verification: "The slope of the line represents the Resistance (R) of the conductor.",
      slopeFormula: "Slope (m) = ΔV / ΔI = R",
      fullTitle: "Detailed Graph Analysis",
      subTitle: "Ohm's Law Laboratory Data Visualization",
      closeAnalysis: "Close Analysis",
      return: "Return to Lab",
      axisI: "I (Ampere)",
      axisV: "V (Volt)"
    },
    observation: {
      system: "Data Logging System",
      clear: "Clear All",
      record: "Record Observation",
      noData: "No observations yet",
      export: "Export to CSV"
    },
    checklist: {
      title: "Your Progress",
      completed: "All set! Experiment mastered.",
      items: {
        "place-battery": "Place the Battery on the workspace",
        "place-resistor": "Place a Resistor",
        "place-ammeter": "Place an Ammeter (series)",
        "place-voltmeter": "Place a Voltmeter (parallel)",
        "place-rheostat": "Place a Rheostat",
        "place-switch": "Place the Plug Key (Switch)",
        "connect-all": "Connect all terminals to form a circuit",
        "close-switch": "Close the switch",
        "record-reading": "Record at least 1 observation",
        "vary-rheostat": "Adjust rheostat for different readings",
        "place-resistors": "Place all 4 resistors (P, Q, R, S)",
        "place-galvanometer": "Place the Galvanometer",
        "place-switches": "Place the switches",
        "connect-bridge": "Wire up the bridge configuration",
        "close-switches": "Close both switches",
        "balance-bridge": "Adjust R until galvanometer reads 0",
        "place-source": "Place a light source (Object)",
        "place-lens": "Place a convex or concave lens",
        "observe-rays": "Observe the ray tracing paths",
        "vary-position": "Move the object to different positions",
        "place-pulley": "Place the fixed pulley",
        "place-m1": "Place mass block M1",
        "place-m2": "Place mass block M2",
        "observe-vectors": "Observe force and acceleration vectors"
      }
    }
  },
  instruments: {
    battery: "Battery",
    resistor: "Resistor",
    ammeter: "Ammeter",
    voltmeter: "Voltmeter",
    rheostat: "Rheostat",
    switch: "Plug Key",
    fixedP: "P (Fixed)",
    fixedQ: "Q (Fixed)",
    varR: "R (Variable)",
    unS: "S (Unknown)",
    galvanometer: "Galvanometer",
    keyK1: "Key K1",
    keyK2: "Key K2",
    source: "Object (Source)",
    convex: "Convex Lens",
    concave: "Concave Lens",
    plane: "Plane Mirror",
    screen: "Screen",
    pulley: "Fixed Pulley",
    m1: "Mass Block M1",
    m2: "Mass Block M2",
    stopwatch: "Stopwatch",
    scale: "Meter Scale"
  },
  feedback: {
    valid: "Circuit is valid",
    issues: "Issues Found",
    suggestions: "Next Steps",
    UNCONNECTED_TERMINAL: "{name} has an unconnected {terminal} terminal",
    SHORT_CIRCUIT: "Caution: Short circuit detected!",
    MISSING_BATTERY: "Battery needed to provide power",
    MISSING_GROUND: "Ground connection required for safety (optional)",
    SUGGEST_BATTERY: "Drag a Battery from the instrument panel to the workspace",
    SUGGEST_RESISTOR: "Add a Resistor to measure V=IR relationship",
    SUGGEST_ALL_RESISTORS: "Add all four resistors: P, Q, R, and S",
    SUGGEST_AMMETER: "Add an Ammeter in series to measure current",
    SUGGEST_VOLTMETER: "Add a Voltmeter in parallel to measure potential difference",
    SUGGEST_SWITCH: "Add a Switch (Plug Key) to control the circuit",
    SUGGEST_ANY_SWITCH: "Add at least one switch to control the circuit",
    SUGGEST_CLOSE_LOOP: "Connect the remaining terminals to form a complete circuit path",
    SUGGEST_GALVANOMETER: "Add a Galvanometer to detect bridge balance"
  },
  landing: {
    hero: {
      badge: "The Future of STEM Education",
      title1: "Master Physics",
      title2: "Through Discovery.",
      description: "Step into an interactive virtual laboratory. Build circuits, trace rays, and explore the laws of nature with precision simulations.",
      enterLab: "Enter Virtual Lab",
      joinFree: "Join for Free"
    },
    stats: {
      curriculum: "Curriculum Aligned",
      domains: "Physics Domains",
      engine: "Simulation Engine",
      accessible: "Accessible Anywhere"
    },
    domains: {
      title: "Explore Diverse",
      subTitle: "Learning Domains",
      description: "From subatomic particles to celestial mechanics, our laboratory covers the entire spectrum of high-school and undergraduate physics.",
      electricity: {
        title: "Electricity & Magnetism",
        desc: "Design complex circuits with real-world instruments. Master Ohm’s Law, Wheatstone Bridge, and RLC series."
      },
      optics: {
        title: "Optics & Light",
        desc: "Trace laser rays through lenses, prisms, and mirrors. Visualize refraction and discover image formation properties."
      },
      mechanics: {
        title: "Classical Mechanics",
        desc: "Investigate forces, torque, and motion. Conduct virtual Atwood machine experiments and verify Newton's Laws."
      },
      browse: "Browse Experiments"
    },
    why: {
      titleLine1: "Designed for the",
      titleLine2: "Digital-First",
      titleLine3: "Generation",
      riskFree: {
        title: "Risk-Free Exploration",
        desc: "Experiments that are dangerous or expensive in real life are now completely safe and infinitely repeatable."
      },
      feedback: {
        title: "Intelligent Feedback",
        desc: "Our engine detects circuit errors and provides real-time hints, acting like a private tutor at every step."
      },
      reports: {
        title: "Automated Lab Reports",
        desc: "Focus on the science, not the formatting. Generate professional lab reports with your observations instantly."
      }
    },
    features: {
      calculation: "Live Calculation",
      state: "Experiment State",
      valid: "Circuit Valid",
      rayTracing: "Ray Tracing"
    },
    testimonials: {
      badge: "Scientific Impact",
      title: "Empowering Learners",
      titleSpan: "Globally",
      description: "Join thousands of students and educators transforming the STEM experience through active experimentation.",
      quote1: "This lab turned complex circuit diagrams into something I could actually see and play with. My grades improved within weeks!",
      author1: "Sarah J.",
      role1: "High School Student",
      status1: "Verified Learner",
      quote2: "As a teacher, PhysicsLab has been a lifesaver for remote learning. It’s the most accurate web-based simulation I've used.",
      author2: "Dr. Marcus V.",
      role2: "Physics Professor",
      status2: "Expert Educator",
      quote3: "The ray tracing visualization is simply stunning. It's so much easier to explain focal lengths when you can actually see the rays bend.",
      author3: "Elena R.",
      role3: "Science Educator",
      status3: "Curriculum Lead"
    },
    cta: {
      badge: "Ready to explore?",
      title1: "Start Your",
      title2: "Virtual Experiment",
      title3: "Today.",
      description: "Join the digital frontier of STEM education. No physical equipment required—just curiosity and a browser.",
      getStarted: "Get Started Free",
      exploreGuide: "Explore the Guide"
    }
  },
  templates: {
    badge: "Lab Templates",
    title1: "Ready-Made",
    title2: "Experiment Templates",
    description: "Browse our curated collection of pre-built lab experiments. Each template is curriculum-aligned and ready to use — just open and start experimenting.",
    featured: "Featured",
    minutes: "min",
    students: "students",
    tryTemplate: "Try This Template",
    categories: {
      all: "All Templates",
      electricity: "Electricity",
      optics: "Optics",
      mechanics: "Mechanics"
    },
    difficulty: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced"
    },
    gradeLevel: {
      beginner: "Grade 9-10",
      intermediate: "Grade 11-12",
      advanced: "Undergraduate"
    },
    items: {
      "ohm-law": {
        title: "Ohm's Law Verification",
        desc: "Build a circuit with a battery, resistor, ammeter, and voltmeter to verify the linear relationship between voltage and current."
      },
      "wheatstone-bridge": {
        title: "Wheatstone Bridge",
        desc: "Determine an unknown resistance by balancing a four-resistor bridge network and observing galvanometer deflection."
      },
      "reflection-refraction": {
        title: "Reflection & Refraction",
        desc: "Trace light rays through lenses and mirrors. Observe how light bends at boundaries between different media."
      },
      "newton-second-law": {
        title: "Newton's Second Law",
        desc: "Connect masses via a pulley system to study the relationship between net force, mass, and acceleration."
      },
      "series-parallel": {
        title: "Series & Parallel Circuits",
        desc: "Compare current and voltage distribution in series vs parallel resistor configurations."
      },
      "pendulum": {
        title: "Simple Pendulum",
        desc: "Measure the time period of a pendulum for different lengths to verify the relationship between period and length."
      }
    },
    cta: {
      badge: "For Educators & Students",
      title1: "Build Your Own",
      title2: "Custom Templates",
      description: "Need a specific experiment setup? Create your own templates or customize existing ones to match your curriculum and classroom needs.",
      exploreLab: "Explore the Lab",
      joinFree: "Join for Free"
    }
  },
  footer: {
    experiments: "Experiments",
    reports: "Lab Reports",
    dashboard: "Dashboard",
    templates: "Templates",
    docs: "Docs",
    copyright: "PhysicsLab. Built for students & teachers."
  }
};
