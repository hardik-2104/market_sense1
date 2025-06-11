import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// Helper function and data can be defined outside the component
const TABS_DATA = {
    'first-order': { title: 'First-Order Markov', desc: 'Robust, scalable, and interpretable. Assumes the next step only depends on the current one.', stats: { accuracy: 60, complexity: 30, data_needs: 50 }},
    'higher-order': { title: 'Higher-Order Markov', desc: 'More sequence-aware but requires more data and is more complex to implement.', stats: { accuracy: 75, complexity: 60, data_needs: 70 }},
    'rnn': { title: 'RNN / LSTM', desc: 'Highest potential accuracy by reading the entire journey. Very computationally heavy and requires massive data.', stats: { accuracy: 90, complexity: 95, data_needs: 95 }},
};

// --- Reusable Components ---

const StatCard = ({ label, value, description }) => (
    <div className="bg-white dark:bg-white rounded-lg shadow-md p-6 text-center text-gray-800">
        <p className="text-lg font-semibold text-gray-500">{label}</p>
        <p className="text-5xl font-bold text-[#0077B6] my-2">{value}</p>
        <p className="text-gray-600">{description}</p>
    </div>
);

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    return (
        <div className="bg-white dark:bg-white rounded-lg shadow-md">
            <button
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <span className={`text-2xl text-[#FB8500] transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0px' }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div className="p-5 pt-0 text-gray-700">{children}</div>
            </div>
        </div>
    );
};

const PowerValueChart = () => {
    const data = {
        labels: ['Sales Call', 'Email', 'Webcast', 'Web', 'Tools'],
        datasets: [
            {
                label: 'Attribution Weight (%)',
                data: [45, 35, 12, 6, 2],
                backgroundColor: '#ADE8F4',
                borderColor: '#00B4D8',
                borderWidth: 2,
            },
            {
                label: 'Attributed Revenue ($k)',
                data: [350, 155, 95, 40, 15],
                backgroundColor: '#0077B6',
                borderColor: '#023E8A',
                borderWidth: 2,
            }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    color: '#1f2937' // dark gray for legend text
                }
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const item = tooltipItems[0];
                        let label = item.chart.data.labels[item.dataIndex];
                        return Array.isArray(label) ? label.join(' ') : label;
                    }
                }
            }
        },
        scales: {
            y: { 
                grid: { display: false },
                ticks: { color: '#374151' } 
            },
            x: { 
                beginAtZero: true,
                ticks: { color: '#374151' }
            }
        }
    };

    return (
        <div className="relative w-full max-w-[500px] mx-auto h-[280px] max-h-[320px]">
            <Bar data={data} options={options} />
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [activeTab, setActiveTab] = useState('first-order');

    // This effect runs once when the app mounts to prevent dark mode.
    useEffect(() => {
        // This is the fix: it removes the 'dark' class from the html element
        // that Tailwind might automatically add based on system preferences.
        document.documentElement.classList.remove('dark');
    }, []);

    const renderTabContent = () => {
        const data = TABS_DATA[activeTab];
        if (!data) return null;

        return (
            <div>
                <h4 className="text-xl font-bold text-[#0077B6] mb-2">{data.title}</h4>
                <p className="text-gray-600 mb-6">{data.desc}</p>
                <div className="space-y-4">
                    {Object.entries(data.stats).map(([key, value]) => (
                        <div key={key}>
                            <span className="text-sm font-semibold text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                            <div className="mt-1 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-3 rounded-full transition-all ease-in-out duration-500 ${value > 80 ? 'bg-[#FB8500]' : 'bg-[#0077B6]'}`}
                                    style={{ width: `${value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="font-sans bg-[#f0f9ff] text-gray-800 antialiased">
            <main className="container mx-auto p-4 md:p-8 max-w-6xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#023E8A] mb-4">The Art of Attribution: From Data to Decisions</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">An interactive guide for business leaders on transforming complex multi-touch attribution data into clear, actionable strategy.</p>
                </header>

                <section className="text-center mb-20">
                    <h2 className="text-3xl font-bold mb-8">Start with the "So What?"</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <StatCard label="Analyzed Journeys" value="1.2 Million" description="to uncover hidden patterns in customer behavior." />
                        <StatCard label="Top Performing Channel" value="Sales Calls" description="emerged as the most powerful closing touchpoint." />
                        <StatCard label="Attributed Revenue" value="$4.5M" description="quantified and assigned to specific marketing efforts." />
                    </div>
                </section>

                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">The 3-Act Story: How to Present Your Findings</h2>
                        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Structure your presentation as a compelling narrative to guide your audience from data to decision.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-white dark:bg-white rounded-lg shadow-md p-8 text-gray-800">
                            <h3 className="text-2xl font-bold mb-4 text-[#023E8A]">Act 1 & 2: Power vs. Value</h3>
                            <p className="text-gray-700 mb-6">Start by showing the model's "Power Ranking" (overall channel importance) and immediately translate it into the "Value Ranking" (attributed revenue). This connects abstract weights to tangible business impact.</p>
                            <PowerValueChart />
                        </div>
                        <div className="bg-white dark:bg-white rounded-lg shadow-md p-8 text-gray-800">
                            <h3 className="text-2xl font-bold mb-4 text-[#023E8A]">Act 3: The "Why" Behind the Data</h3>
                            <p className="text-gray-700 mb-6">Use a flow diagram to illustrate *how* customers move between channels. This narrative context explains why a channel is valuable, revealing its role as an opener, nurturer, or closer.</p>
                            <div className="bg-[#ADE8F4] p-6 rounded-lg text-center">
                                <h4 className="font-bold text-[#0077B6] text-lg">Example Customer Journey Flow</h4>
                                <div className="mt-4 space-y-2 flex flex-col items-center">
                                    <div className="font-semibold bg-white p-2 rounded-md shadow w-48 text-gray-800">Social (Opener)</div>
                                    <div className="text-2xl text-[#0077B6]">→</div>
                                    <div className="font-semibold bg-white p-2 rounded-md shadow w-48 text-gray-800">Web (Nurturer)</div>
                                    <div className="text-2xl text-[#0077B6]">→</div>
                                    <div className="font-semibold bg-white p-2 rounded-md shadow w-48 text-gray-800">Sales Call (Closer)</div>
                                </div>
                                <p className="text-sm mt-4 text-[#023E8A]">This path shows how upper-funnel activities effectively generate leads for sales.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">The Actionable Playbook</h2>
                        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Convert each key insight into a concrete, testable recommendation. Click to expand.</p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        <AccordionItem title="Insight: 'Display' ads have low attribution.">
                            <p className="font-bold text-[#0077B6]">Recommendation:</p>
                            <p>Re-evaluate the Q3 budget for Display. Propose a test to re-allocate 50% of the spend to 'Paid Search' to measure the impact on lead quality and conversion rate.</p>
                        </AccordionItem>
                        <AccordionItem title="Insight: 'Email' is a top-performing channel.">
                             <p className="font-bold text-[#0077B6]">Recommendation:</p>
                             <p>Double down on email effectiveness. Launch an A/B test on the cart abandonment sequence to increase recovery rate and develop two new promotional campaigns targeting high-value customer segments.</p>
                        </AccordionItem>
                    </div>
                </section>
                
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Future-Proofing Your Strategy</h2>
                        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Understand the trade-offs when considering more advanced attribution models.</p>
                    </div>
                    <div className="bg-white dark:bg-white rounded-lg shadow-md max-w-4xl mx-auto p-8 text-gray-800">
                        <div className="flex justify-center border-b mb-6">
                            {Object.keys(TABS_DATA).map(tabKey => (
                                <button
                                    key={tabKey}
                                    onClick={() => setActiveTab(tabKey)}
                                    className={`p-4 font-semibold border-b-4 ${activeTab === tabKey ? 'border-[#0077B6] text-[#0077B6]' : 'border-transparent text-gray-500 hover:text-[#0077B6]'}`}
                                >
                                    {TABS_DATA[tabKey].title}
                                </button>
                            ))}
                        </div>
                        <div className="min-h-[250px]">
                            {renderTabContent()}
                        </div>
                    </div>
                </section>

                <footer className="text-center mt-12 pt-8 border-t">
                    <h3 className="font-bold text-lg">Key Considerations</h3>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 text-gray-600">
                        <p>✓ Be honest about model limitations</p>
                        <p>✓ Correlation is not causation</p>
                        <p>✓ Use as a guide for strategic testing</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
