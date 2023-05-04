module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        1600: "1600px",
        400: "400px",
        450: "450px",
        210: "210px",
        550: "550px",
        260: "260px",
        650: "650px",
      },
      height: {
        600: "600px",
        280: "280px",
        900: "900px",
        458: "458px",
      },
      top: {
        " 50%": "50%",
      },
      backgroundColor: {
        primary: "#444444",
        blur: "#030303",
      },
      colors: {
        primary: "rgb(217,218,225)",
      },
      height: {
        "88vh": "88vh",
      },
      backgroundImage: {
        "blurred-img":
          "url('https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
      },
    },
  },
  plugins: [],
};
