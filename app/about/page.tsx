import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Me</h1>
          
          <div className="prose prose-invert">
            <p className="text-xl text-gray-300 mb-6">
              I&apos;m a Senior Data Engineer with expertise in building scalable data pipelines
              and distributed systems on Google Cloud Platform.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Technical Expertise</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Google Cloud Platform (GCP)</li>
              <li>• Apache Beam for data processing</li>
              <li>• Apache Airflow for workflow orchestration</li>
              <li>• BigQuery for data warehousing</li>
              <li>• Dataflow for streaming and batch processing</li>
              <li>• Cloud Pub/Sub for event-driven architectures</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">What I Do</h2>
            <p className="text-gray-300">
              I design and implement robust data engineering solutions that handle
              massive scale while maintaining data quality and reliability. My work
              focuses on building efficient data pipelines, optimizing query performance,
              and ensuring data governance best practices.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Get in Touch</h2>
            <p className="text-gray-300">
              Feel free to reach out for collaborations, discussions about data engineering,
              or just to say hello!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
