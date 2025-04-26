
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SEOData {
  title: string;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_url: string | null;
  canonical_url: string | null;
  robots_content: string | null;
}

export const useSEO = () => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_path', location.pathname)
          .single();

        if (error) {
          console.error('Error fetching SEO data:', error);
          return;
        }

        setSeoData(data);
        updateMetaTags(data);
      } catch (error) {
        console.error('Error in SEO hook:', error);
      }
    };

    fetchSEOData();
  }, [location.pathname]);

  const updateMetaTags = (data: SEOData) => {
    // Update title
    document.title = data.title;

    // Update meta tags
    updateMetaTag('description', data.description);
    updateMetaTag('keywords', data.keywords);
    updateMetaTag('robots', data.robots_content);

    // Update Open Graph tags
    updateMetaTag('og:title', data.og_title || data.title);
    updateMetaTag('og:description', data.og_description || data.description);
    updateMetaTag('og:image', data.og_image_url);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', data.twitter_card || 'summary_large_image');
    updateMetaTag('twitter:title', data.twitter_title || data.title);
    updateMetaTag('twitter:description', data.twitter_description || data.description);
    updateMetaTag('twitter:image', data.twitter_image_url);

    // Update canonical URL
    updateCanonicalUrl(data.canonical_url);
  };

  const updateMetaTag = (name: string, content: string | null) => {
    if (!content) return;

    let element = document.querySelector(`meta[name="${name}"]`) ||
                 document.querySelector(`meta[property="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      name.startsWith('og:') ? element.setAttribute('property', name) : element.setAttribute('name', name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  };

  const updateCanonicalUrl = (url: string | null) => {
    if (!url) return;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  return { seoData };
};
