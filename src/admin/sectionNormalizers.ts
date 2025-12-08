import { getTemplateFor } from '@/types/content';

export function normalizeSectionData(section: string, d: any): any {
  if (section === 'fredAgain') {
    return {
      heading: typeof d?.heading === 'string' ? d.heading : '',
      subheading: typeof d?.subheading === 'string' ? d.subheading : '',
      backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
      backgroundImageSrcSet: typeof d?.backgroundImageSrcSet === 'string' ? d.backgroundImageSrcSet : '',
      logoUrls: Array.isArray(d?.logoUrls) ? d.logoUrls : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'hero') {
    return {
      logoUrl: typeof d?.logoUrl === 'string' ? d.logoUrl : '',
      backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
      backgroundImageSrcSet: typeof d?.backgroundImageSrcSet === 'string' ? d.backgroundImageSrcSet : '',
      mitaText: typeof d?.mitaText === 'string' ? d.mitaText : '',
      subtitle: typeof d?.subtitle === 'string' ? d.subtitle : '',
      leftIdentifier: typeof d?.leftIdentifier === 'string' ? d.leftIdentifier : '',
      rightIdentifier: typeof d?.rightIdentifier === 'string' ? d.rightIdentifier : '',
      motifs: Array.isArray(d?.motifs) ? d.motifs : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'errorPage') {
    return {
      error404: d?.error404 && typeof d.error404 === 'object' ? {
        title: typeof d.error404.title === 'string' ? d.error404.title : '',
        description: typeof d.error404.description === 'string' ? d.error404.description : ''
      } : { title: '', description: '' },
      error500: d?.error500 && typeof d.error500 === 'object' ? {
        title: typeof d.error500.title === 'string' ? d.error500.title : '',
        description: typeof d.error500.description === 'string' ? d.error500.description : ''
      } : { title: '', description: '' },
      error403: d?.error403 && typeof d.error403 === 'object' ? {
        title: typeof d.error403.title === 'string' ? d.error403.title : '',
        description: typeof d.error403.description === 'string' ? d.error403.description : ''
      } : { title: '', description: '' },
      defaultError: d?.defaultError && typeof d.defaultError === 'object' ? {
        title: typeof d.defaultError.title === 'string' ? d.defaultError.title : '',
        description: typeof d.defaultError.description === 'string' ? d.defaultError.description : ''
      } : { title: '', description: '' },
      backButtonText: typeof d?.backButtonText === 'string' ? d.backButtonText : '',
      backgroundPatternImage: typeof d?.backgroundPatternImage === 'string' ? d.backgroundPatternImage : '',
      arrowIcon: typeof d?.arrowIcon === 'string' ? d.arrowIcon : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'faqIntro') {
    let records: any[] = [];
    if (d?.records && Array.isArray(d.records)) {
      records = d.records.map((r: any, idx: number) => ({
        id: typeof r?.id === 'string' && r.id ? r.id : `record-${idx + 1}-${Date.now()}`,
        imageUrl: typeof r?.imageUrl === 'string' ? r.imageUrl : '',
        spotifyUrl: typeof r?.spotifyUrl === 'string' ? r.spotifyUrl : 'https://open.spotify.com/'
      }));
    } else if (d?.recordImage || d?.recordCount || d?.spotifyUrl) {
      const recordCount = typeof d?.recordCount === 'number' && d.recordCount > 0 ? d.recordCount : 1;
      const recordImage = typeof d?.recordImage === 'string' ? d.recordImage : '/assets/img/Playlist R&B Retro Nostalgia.png';
      const spotifyUrl = typeof d?.spotifyUrl === 'string' ? d.spotifyUrl : 'https://open.spotify.com/';
      records = Array.from({ length: recordCount }, (_, idx) => ({
        id: `record-${idx + 1}-${Date.now()}`,
        imageUrl: recordImage,
        spotifyUrl: spotifyUrl
      }));
    }
    if (records.length === 0) {
      records = [{
        id: `record-1-${Date.now()}`,
        imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
        spotifyUrl: 'https://open.spotify.com/'
      }];
    }
    return {
      starCount: typeof d?.starCount === 'number' ? d.starCount : 7,
      records: records,
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'investmentIntro') {
    return {
      heading: typeof d?.heading === 'string' ? d.heading : '',
      subtitle: typeof d?.subtitle === 'string' ? d.subtitle : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'privacyPolicy') {
    const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
    if (hasOldFormat) {
      d = getTemplateFor('privacyPolicy');
    }
    
    let sections: any[] = [];
    let introText: string[] = [];
    
    if (d?.sections && Array.isArray(d.sections)) {
      sections = d.sections.map((s: any) => ({
        title: typeof s?.title === 'string' ? s.title : '',
        paragraphs: Array.isArray(s?.paragraphs) ? s.paragraphs : [],
        lists: Array.isArray(s?.lists) ? s.lists : [],
        contactInfo: s?.contactInfo && typeof s.contactInfo === 'object' ? {
          email: typeof s.contactInfo.email === 'string' ? s.contactInfo.email : '',
          address: typeof s.contactInfo.address === 'string' ? s.contactInfo.address : ''
        } : undefined
      }));
    }
    
    if (Array.isArray(d?.introText)) {
      introText = d.introText.filter((t: any) => typeof t === 'string');
    } else if (typeof d?.introText === 'string') {
      introText = [d.introText];
    }
    
    return {
      pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : 'Privacy Policy',
      lastUpdated: typeof d?.lastUpdated === 'string' ? d.lastUpdated : '',
      introText: introText,
      sections: sections,
      footerButtonText: typeof d?.footerButtonText === 'string' ? d.footerButtonText : '',
      footerButtonEmail: typeof d?.footerButtonEmail === 'string' ? d.footerButtonEmail : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'terms') {
    const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
    if (hasOldFormat) {
      d = getTemplateFor('terms');
    }
    
    let sections: any[] = [];
    let introText: string[] = [];
    
    if (d?.sections && Array.isArray(d.sections)) {
      sections = d.sections.map((s: any) => ({
        title: typeof s?.title === 'string' ? s.title : '',
        paragraphs: Array.isArray(s?.paragraphs) ? s.paragraphs : [],
        lists: Array.isArray(s?.lists) ? s.lists : [],
        disclaimer: s?.disclaimer && typeof s.disclaimer === 'object' ? {
          title: typeof s.disclaimer.title === 'string' ? s.disclaimer.title : '',
          text: typeof s.disclaimer.text === 'string' ? s.disclaimer.text : ''
        } : undefined,
        contactInfo: s?.contactInfo && typeof s.contactInfo === 'object' ? {
          email: typeof s.contactInfo.email === 'string' ? s.contactInfo.email : '',
          address: typeof s.contactInfo.address === 'string' ? s.contactInfo.address : ''
        } : undefined
      }));
    }
    
    if (Array.isArray(d?.introText)) {
      introText = d.introText.filter((t: any) => typeof t === 'string');
    } else if (typeof d?.introText === 'string') {
      introText = [d.introText];
    }
    
    return {
      pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : 'Terms of Service',
      lastUpdated: typeof d?.lastUpdated === 'string' ? d.lastUpdated : '',
      introText: introText,
      sections: sections,
      footerButtonText: typeof d?.footerButtonText === 'string' ? d.footerButtonText : '',
      footerButtonEmail: typeof d?.footerButtonEmail === 'string' ? d.footerButtonEmail : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'investment') {
    return {
      backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
      mainHeading: typeof d?.mainHeading === 'string' ? d.mainHeading : '',
      animatedWords: Array.isArray(d?.animatedWords) ? d.animatedWords : [],
      comingSoonTitle: typeof d?.comingSoonTitle === 'string' ? d.comingSoonTitle : '',
      dateText: typeof d?.dateText === 'string' ? d.dateText : '',
      logoImage: typeof d?.logoImage === 'string' ? d.logoImage : '',
      welcomeText: typeof d?.welcomeText === 'string' ? d.welcomeText : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'shares') {
    return {
      heading: typeof d?.heading === 'string' ? d.heading : '',
      subheadingMobile: typeof d?.subheadingMobile === 'string' ? d.subheadingMobile : '',
      subheadingWords: Array.isArray(d?.subheadingWords) ? d.subheadingWords : [],
      bodyCopy: typeof d?.bodyCopy === 'string' ? d.bodyCopy : '',
      imageUrl: typeof d?.imageUrl === 'string' ? d.imageUrl : '',
      imageSrcSet: typeof d?.imageSrcSet === 'string' ? d.imageSrcSet : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'ticker') {
    return {
      backgroundColor: typeof d?.backgroundColor === 'string' ? d.backgroundColor : '#bbdbfa',
      tickerWords: Array.isArray(d?.tickerWords) ? d.tickerWords : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'nftDisclaimer') {
    return {
      nopeText: typeof d?.nopeText === 'string' ? d.nopeText : 'Nope',
      wereText: typeof d?.wereText === 'string' ? d.wereText : "We're",
      nftsText: typeof d?.nftsText === 'string' ? d.nftsText : 'NFTs',
      valueMusicText: typeof d?.valueMusicText === 'string' ? d.valueMusicText : 'We value mu$ic more than pixels',
      resonateText: typeof d?.resonateText === 'string' ? d.resonateText : 'We\'re building something that resonates with everyone. Not just "PR".',
      resonateTextMobile: typeof d?.resonateTextMobile === 'string' ? d.resonateTextMobile : "we're building something that resonates with everyone. Not just crypto bros.",
      monaImageUrl: typeof d?.monaImageUrl === 'string' ? d.monaImageUrl : '/assets/img/mona-image2.jpg',
      monaImageSrcSet: typeof d?.monaImageSrcSet === 'string' ? d.monaImageSrcSet : '',
      gifImageUrl: typeof d?.gifImageUrl === 'string' ? d.gifImageUrl : '/assets/img/fav.gif',
      starIconUrl: typeof d?.starIconUrl === 'string' ? d.starIconUrl : '/assets/svg/hardwey-star.svg',
      notGraphicUrl: typeof d?.notGraphicUrl === 'string' ? d.notGraphicUrl : 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg',
      backgroundColor: typeof d?.backgroundColor === 'string' ? d.backgroundColor : '#d12d37',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'faq') {
    return {
      faqItems: Array.isArray(d?.faqItems) ? d.faqItems.map((item: any) => ({
        id: typeof item?.id === 'string' ? item.id : `faq-${Date.now()}`,
        question: typeof item?.question === 'string' ? item.question : '',
        subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
        answer: typeof item?.answer === 'string' ? item.answer : '',
        additionalInfo: Array.isArray(item?.additionalInfo) ? item.additionalInfo : ['', '']
      })) : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'founders') {
    return {
      founders: Array.isArray(d?.founders) ? d.founders.map((item: any) => ({
        id: typeof item?.id === 'string' ? item.id : `founder-${Date.now()}`,
        name: typeof item?.name === 'string' ? item.name : '',
        role: typeof item?.role === 'string' ? item.role : '',
        bio: typeof item?.bio === 'string' ? item.bio : '',
        quote: typeof item?.quote === 'string' ? item.quote : '',
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
        imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
        additionalInfo: Array.isArray(item?.additionalInfo) ? item.additionalInfo : []
      })) : [],
      heading: typeof d?.heading === 'string' ? d.heading : '',
      headingSingular: typeof d?.headingSingular === 'string' ? d.headingSingular : '',
      animatedWords: Array.isArray(d?.animatedWords) ? d.animatedWords : [],
      animatedTextMobile: typeof d?.animatedTextMobile === 'string' ? d.animatedTextMobile : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'partners') {
    return {
      pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : '',
      pageSubtitle: typeof d?.pageSubtitle === 'string' ? d.pageSubtitle : '',
      partners: Array.isArray(d?.partners) ? d.partners.map((item: any, index: number) => ({
        id: typeof item?.id === 'string' && item.id ? item.id : `partner-${index}-${Date.now()}`,
        name: typeof item?.name === 'string' ? item.name : '',
        title: typeof item?.title === 'string' ? item.title : '',
        description: typeof item?.description === 'string' ? item.description : '',
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
        imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
        websiteUrl: typeof item?.websiteUrl === 'string' ? item.websiteUrl : '',
        socialLinks: Array.isArray(item?.socialLinks) ? item.socialLinks.map((sl: any) => ({
          platform: typeof sl?.platform === 'string' ? sl.platform : '',
          url: typeof sl?.url === 'string' ? sl.url : ''
        })) : []
      })) : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'collaboratives') {
    return {
      heading: typeof d?.heading === 'string' ? d.heading : '',
      collaboratives: Array.isArray(d?.collaboratives) ? d.collaboratives.map((item: any, index: number) => ({
        id: typeof item?.id === 'string' && item.id ? item.id : `collaborative-${index}-${Date.now()}`,
        name: typeof item?.name === 'string' ? item.name : '',
        title: typeof item?.title === 'string' ? item.title : '',
        description: typeof item?.description === 'string' ? item.description : '',
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
        imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
        websiteUrl: typeof item?.websiteUrl === 'string' ? item.websiteUrl : '',
        socialLinks: Array.isArray(item?.socialLinks) ? item.socialLinks.map((sl: any) => ({
          platform: typeof sl?.platform === 'string' ? sl.platform : '',
          url: typeof sl?.url === 'string' ? sl.url : ''
        })) : []
      })) : [],
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  if (section === 'moreFaq') {
    let faqItems: any[] = [];
    if (d?.faqItems && Array.isArray(d.faqItems)) {
      faqItems = d.faqItems.map((item: any, index: number) => ({
        id: typeof item?.id === 'string' && item.id ? item.id : `faq-item-${index}-${Date.now()}`,
        question: typeof item?.question === 'string' ? item.question : '',
        subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
        answer: typeof item?.answer === 'string' ? item.answer : '',
        additionalInfo: Array.isArray(item?.additionalInfo) && item.additionalInfo.length >= 2 
          ? item.additionalInfo.slice(0, 2)
          : Array.isArray(item?.additionalInfo) && item.additionalInfo.length === 1
          ? [item.additionalInfo[0], '']
          : typeof item?.additionalInfo === 'string'
          ? [item.additionalInfo, '']
          : ['', '']
      }));
    }
    
    return {
      pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : '',
      pageSubtitle: typeof d?.pageSubtitle === 'string' ? d.pageSubtitle : '',
      faqItems: faqItems,
      imageUrl: typeof d?.imageUrl === 'string' ? d.imageUrl : '',
      contactHeading: typeof d?.contactHeading === 'string' ? d.contactHeading : '',
      contactButtonText: typeof d?.contactButtonText === 'string' ? d.contactButtonText : '',
      contactEmail: typeof d?.contactEmail === 'string' ? d.contactEmail : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
  }
  
  return {
    text: typeof d?.text === 'string' ? d.text : '',
    images: Array.isArray(d?.images) ? d.images : [],
    links: Array.isArray(d?.links) ? d.links : []
  };
}

