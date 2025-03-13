import React from "react";

const About = () => {
  const features = [
    {
      title: "AI-Powered Feedback",
      img: "/external/ai-coach.jpg",
      text: "Real-time posture correction and exercise analysis.",
    },
    {
      title: "Personalized Workouts",
      img: "/external/workout.jpg",
      text: "Customized plans based on your fitness level.",
    },
    {
      title: "Progress Tracking",
      img: "/external/progress.jpg",
      text: "Monitor improvements and set goals.",
    },
  ];

  return (
    <div className="container mx-auto my-10 px-4 text-center">
      {/* العنوان الرئيسي */}
      <h1 className="text-4xl font-bold text-blue-600">About Us</h1>
      <p className="mt-2 text-gray-600">
        Empowering fitness through AI-driven innovation
      </p>

      {/* قسم "Who We Are" */}
      <div className="flex flex-col md:flex-row items-center my-10">
        <div className="md:w-1/2 text-left">
          <h2 className="text-2xl font-bold">Who We Are</h2>
          <p className="mt-4 text-gray-600">
            We are a team of passionate students from{" "}
            <strong>Tabuk University</strong>, dedicated to leveraging technology
            to enhance the fitness industry. Our project,{" "}
            <strong>Smart Coach</strong>, is designed to revolutionize the way
            people train by providing <strong>real-time AI feedback</strong> and{" "}
            <strong>personalized workout guidance</strong>.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="/images/logo.png"
            alt="Tabuk University"
            className="w-3/4 mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* قسم "Our Mission" */}
      <h2 className="text-2xl font-bold text-blue-600 mt-12">Our Mission</h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Our mission is to <strong>make fitness training accessible, accurate, and effective</strong> by utilizing the power of AI. We aim to help users perfect their exercise techniques and track their progress effortlessly.
      </p>

      {/* قسم الميزات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-600">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;