import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLiff } from '../contexts/LiffContext';
import { PageNavigationConfig, NavigationHookReturn } from '../types/navigation';

export const usePageNavigation = (config: PageNavigationConfig): NavigationHookReturn => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isInitialized } = useLiff();

  useEffect(() => {
    if (!isInitialized) return;

    const pageParam = searchParams.get('page');
    
    if (pageParam) {
      const normalizedPage = pageParam.toLowerCase().trim();
      
      if (config.validPages.includes(normalizedPage)) {
        navigate(`/${normalizedPage}`, { 
          replace: config.replaceHistory ?? true 
        });
      } else if (config.defaultPage) {
        navigate(`/${config.defaultPage}`, { 
          replace: config.replaceHistory ?? true 
        });
      }
    }
  }, [searchParams, navigate, isInitialized, config]);

  return {
    currentPage: searchParams.get('page'),
    isInitialized
  };
};