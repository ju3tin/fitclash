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
          "question": "What is FitClash?",
          "answer": "FitClash is a skill-based wagering dApp on Solana that allows players to compete in fitness-based challenges and earn rewards."
        },
        {
          "question": "How does FitClash work?",
          "answer": "Players engage in fitness challenges, wager SOL or tokens, and compete based on their performance. Winners receive rewards from the prize pool."
        },
        {
          "question": "Do I need crypto to play?",
          "answer": "Yes, you’ll need a Solana wallet with SOL for transactions and wagers."
        },
        {
          "question": "What kind of fitness challenges are available?",
          "answer": "FitClash includes various challenges like step counts, push-ups, and endurance-based competitions."
        },
        {
          "question": "How is fairness ensured?",
          "answer": "FitClash uses smart contracts and verifiable fitness tracking data to ensure fair competition."
        },
        {
          "question": "Can I play for free?",
          "answer": "Some modes may allow free participation, but wagering requires SOL or tokens."
        },
        {
          "question": "Why is FitClash built on Solana?",
          "answer": "Solana offers fast transactions, low fees, and high scalability, making it ideal for FitClash’s real-time wagering mechanics."
        },
        {
          "question": "Is my data secure?",
          "answer": "Yes, FitClash uses blockchain security and decentralized data verification to protect user information."
        },
        {
          "question": "How do I create an account?",
          "answer": "Connect your Solana wallet to FitClash, and you're ready to go—no traditional sign-up needed."
        },
        {
          "question": "Which wallets are supported?",
          "answer": "FitClash supports popular Solana wallets like Phantom and Solflare."
        },
        {
          "question": "How do I deposit funds?",
          "answer": "Transfer SOL to your connected wallet and use it to place wagers on FitClash."
        },
        {
          "question": "How do I claim my winnings?",
          "answer": "Winnings are automatically credited to your wallet after a match ends."
        },
        {
          "question": "Are there any withdrawal fees?",
          "answer": "Standard Solana network fees apply, but FitClash does not charge extra withdrawal fees."
        },
        {
          "question": "What if I have an issue?",
          "answer": "You can reach out to our support team via Discord, Telegram, or our official website."
        },
        {
          "question": "How can I stay updated?",
          "answer": "Follow FitClash on Twitter, Discord, and Telegram for updates, tournaments, and community events."
        }
      ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-center mb-4
                           text-2xl font-bold">
                            FAQ - Fitclash
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