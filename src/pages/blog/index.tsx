import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import { getAllPosts, BlogPost } from '@/utils/blog';

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Layout
      title="Debt Relief Blog & Guides | Expert Financial Advice | Freedom Debt Solutions"
      description="Free guides, tips, and expert advice on debt consolidation, debt relief, credit card debt, and financial recovery. Learn how to become debt-free."
      canonical="/blog"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Debt Relief Resources & Expert Guides
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Free guides, actionable tips, and expert advice to help you take
            control of your finances and become debt-free.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Articles Coming Soon
              </h2>
              <p className="text-gray-600 mb-8">
                We&apos;re preparing expert guides to help you on your journey
                to financial freedom. Check back soon!
              </p>
              <LeadForm
                variant="compact"
                source="blog-index-empty"
                heading="Get Expert Debt Help Now"
                subheading="Don't wait — speak with a specialist today."
                className="max-w-md mx-auto"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {posts.map((post) => (
                    <article
                      key={post.slug}
                      className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                        <span className="bg-primary-100 text-primary-700 px-3 py-0.5 rounded-full font-medium">
                          {post.category}
                        </span>
                        <span>{post.date}</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary-600 font-medium hover:text-primary-700"
                      >
                        Read More &rarr;
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <LeadForm
                    variant="compact"
                    source="blog-sidebar"
                    heading="Free Debt Consultation"
                    subheading="See how much you could save."
                  />
                  <div className="mt-8 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Popular Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Debt Consolidation',
                        'Credit Card Debt',
                        'Debt Settlement',
                        'Medical Debt',
                        'Budgeting',
                        'Credit Score',
                        'Bankruptcy Alternatives',
                        'Financial Recovery',
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  return {
    props: { posts },
  };
};
