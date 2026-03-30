import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import {
  getAllPostSlugs,
  getPostBySlug,
  getPostHtml,
  getRelatedPosts,
  BlogPost,
} from '@/utils/blog';

interface BlogPostPageProps {
  post: BlogPost;
  contentHtml: string;
  relatedPosts: BlogPost[];
}

export default function BlogPostPage({
  post,
  contentHtml,
  relatedPosts,
}: BlogPostPageProps) {
  // Insert the inline lead form after the 3rd paragraph
  const paragraphs = contentHtml.split('</p>');
  let processedHtml = contentHtml;
  if (paragraphs.length > 3) {
    const leadFormPlaceholder = '<div id="inline-lead-form"></div>';
    processedHtml =
      paragraphs.slice(0, 3).join('</p>') +
      '</p>' +
      leadFormPlaceholder +
      paragraphs.slice(3).join('</p>');
  }

  return (
    <Layout
      title={`${post.title} | Freedom Debt Solutions Blog`}
      description={post.description}
      canonical={`/blog/${post.slug}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Freedom Debt Solutions',
            },
            keywords: post.keywords.join(', '),
          }),
        }}
      />

      <article>
        <header className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 text-sm text-primary-200 mb-4">
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-primary-200 text-sm">
              <span>By {post.author}</span>
              <span>|</span>
              <span>{post.date}</span>
              <span>|</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              {/* Lead form that replaces the placeholder via CSS/JS or just appears */}
              <LeadForm
                variant="inline"
                source={`blog-${post.slug}`}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <LeadForm
                  variant="compact"
                  source={`blog-sidebar-${post.slug}`}
                  heading="Need Debt Help Now?"
                  subheading="Get a free consultation with a certified specialist."
                />

                {relatedPosts.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/blog/${related.slug}`}
                          className="block hover:bg-white rounded-lg p-3 -mx-3 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {related.date} | {related.readingTime}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const contentHtml = await getPostHtml(post.content);
  const relatedPosts = getRelatedPosts(slug, 3);

  return {
    props: {
      post,
      contentHtml,
      relatedPosts,
    },
  };
};
