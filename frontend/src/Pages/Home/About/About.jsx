import React from 'react';
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg";
import '../Landing/Landing.css';
import Footer from "../../Footer/Footer.jsx";
import Header from '../Header/Header.jsx';

function About() {
  return (
    <>
      <Header />
      <div className="about text-white bg-gradient-to-r from-[#A94444] to-[#3E3B3A] min-h-screen flex flex-col items-center py-10 px-5">
        <h4 className="text-3xl font-bold">About Us</h4>
        <hr className="underLine w-20 border-2 border-white my-4" />
        <div className="content flex flex-col md:flex-row items-center gap-10 max-w-5xl">
          <div className="left-svg">
            <img src={Plant2} className="w-[22rem]" alt="Plant Illustration" />
          </div>
          <p className="text-lg leading-relaxed">
            At <span className="font-bold">KnowledgeHub</span>, we believe in the power of education to transform lives. Our platform is designed to be a gateway to knowledge, offering a diverse range of courses and learning experiences for students.
            <h1 className="bg-[#FF4C4C] w-fit py-1 px-3 rounded-sm my-2 text-white font-semibold">Our Story</h1>
            KnowledgeHub was born out of a passion for learning and a desire to make quality education accessible to everyone. We understand the challenges faced by modern learners and strive to provide a solution that is both convenient and effective.
            <h1 className="bg-[#FF4C4C] w-fit py-1 px-3 rounded-sm my-2 text-white font-semibold">Our Mission</h1>
            Our mission is simple yet profound: to empower individuals through education. We aim to create a global learning community where students can discover new passions, enhance their skills, and achieve their academic and professional goals. By leveraging technology and innovative teaching methods, we strive to make learning engaging, interactive, and enjoyable.
          </p>
          <div className="right-svg">
            <img src={Plant} className="w-[30rem]" alt="Plant Illustration" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
