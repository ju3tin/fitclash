//components/FAQ.js
"use client"; 
// Add this line to mark the component as a Client Component

import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-b last:border-b-0 py-4">
            <div className="flex justify-between items-center
                            cursor-pointer" onClick={toggleOpen}>
                <h3 className="font-semibold text-lg">{question}</h3>
                <svg
                    className={`w-6 h-6 transform transition-transform
                                duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} d="M12 14l-4-4m0
                                             0l4-4m-4 4h8" />
                </svg>
            </div>
            {isOpen && (
                <p className="mt-2 text-gray-600">{answer}</p>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqData = [
        {
            question: "What courses do you offer?",
            answer: `We offer a variety of courses
                     across subjects like programming,
                     data science, design, and business
                     management.`,
        },
        {
            question: "How long do the courses take?",
            answer: `Course duration varies; some are
                     completed in a few hours while others
                     may take several weeks, depending on the
                     depth of the content.`,
        },
        {
            question: "Are the courses self-paced?",
            answer: `Yes, our courses are self-paced,
                     allowing you to learn at your 
                     own speed and convenience.`,
        },
        {
            question: "Do I receive a certificate upon completion?",
            answer: `Yes, upon completing a course, you will
                     receive a certificate that you can download
                     and share.`,
        },
        {
            question: "Is there a money-back guarantee?",
            answer: `Absolutely! If you are not satisfied
                     with a course, you can request a full
                     refund within 30 days of purchase.`,
        },
        {
            question: "Can I access the courses on mobile devices?",
            answer: `Yes, our platform is mobile-friendly,
                     allowing you to access courses on
                     smartphones and tablets.`,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-center mb-4
                           text-2xl font-bold">
                            FAQ - EdTech Platform
                            </h1>
            {faqData.map((item, index) => (
                <FAQItem key={index} 
                question={item.question} 
                answer={item.answer} />
            ))}
        </div>
    );
};

export default FAQ;