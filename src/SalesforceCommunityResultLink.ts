import { Component, IComponentBindings, ComponentOptions, IQueryResult, IResultsComponentBindings, Initialization } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface ISalesforceCommunityResultLinkOptions extends Coveo.IResultLinkOptions  {
  useAsPrintable?: boolean;
  enableUrlRewriter?: boolean;
  name?: string;
  hostName?: string;
  protocol?: string;
}
const fields = [
  '@sfcaseid',
  '@objecttype',
  '@sfparentid',
  '@sffeeditemid',
  '@sfid',
  '@sfcontentdocumentid',
  '@sfideaid',
  '@sfkbid',
  '@sfurlname'
];

@lazyComponent
export class SalesforceCommunityResultLink extends Component {
    static ID = 'SalesforceCommunityResultLink';
    static options: ISalesforceCommunityResultLinkOptions = {
      useAsPrintable: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: false }),
      enableUrlRewriter: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: true }),
      name: Coveo.ComponentOptions.buildStringOption({ defaultValue: '' }),
      hostName: Coveo.ComponentOptions.buildStringOption({ defaultValue: window.location.hostname }),
      protocol: Coveo.ComponentOptions.buildStringOption({ defaultValue: window.location.protocol })
    };

    constructor(public element: HTMLElement, public options: ISalesforceCommunityResultLinkOptions, public bindings: IResultsComponentBindings, public result?: IQueryResult) {
        super(element, SalesforceCommunityResultLink.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, SalesforceCommunityResultLink, options);
        this.result = result;
        if (this.options.enableUrlRewriter) {
          let newurl = this.applyCommunityUrlRewriter();
          if (newurl!=''){
            console.log('URL was: '+this.result.clickUri);
            this.setClickUri(newurl);
            console.log('Changed URL: '+newurl);
          }
        }
    
        if (this.options.useAsPrintable) {
          this.element.textContent = this.result.clickUri;
        }
        new Coveo.ResultLink(this.element, this.options, bindings, result);
    }

    protected applyCommunityUrlRewriter():string {
      let result='';
      const communityUrl = SalesforceCommunityResultLink.getCommunityUrl(this.result, this.options);
      if (communityUrl) {
        result=communityUrl;
      }
      return result;
    }

    private setClickUri(url: string) {
      this.result.clickUri = this.result['ClickUri'] = this.result.raw.clickableuri = this.result.raw.sysclickableuri = url;
    }

    public static getCommunityName(options: ISalesforceCommunityResultLinkOptions) {
      let communityName = window.location.pathname.replace(/\/(.*)\/s\/(.*)/i, '$1');
      communityName = options.name || (communityName != window.location.pathname ? communityName : '');
  
      return communityName;
    }

    public static getCommunityUrl(result: Coveo.IQueryResult, options: ISalesforceCommunityResultLinkOptions) {
      const communityName = SalesforceCommunityResultLink.getCommunityName(options);
      const communityPath = communityName ? `/${communityName}` : '';
      const communityBaseUrl = `${options.protocol}//${options.hostName}${communityPath}`;
      let communityUrl = '';
  
      if (result.raw.objecttype == 'Case') {
        communityUrl = `${communityBaseUrl}/s/case/${result.raw.sfcaseid}`;
      } else if (result.raw.objecttype == 'FeedItem' || result.raw.objecttype == 'FeedComment') {
        const parentId: string = result.raw.sfparentid || '';
        const path = parentId.substr(0, 3) == '005' ? 'question' : 'feed';
        communityUrl = `${communityBaseUrl}/s/${path}/${result.raw.sffeeditemid || result.raw.sfid}`;
      } else if (result.raw.objecttype == 'CollaborationGroup') {
        communityUrl = `${communityBaseUrl}/s/group/${result.raw.sfid}`;
      } else if (result.raw.objecttype == 'ContentVersion') {
        communityUrl = `${communityBaseUrl}/s/contentdocument/${result.raw.sfcontentdocumentid}`;
      } else if (result.raw.objecttype == 'Idea') {
        communityUrl = `${communityBaseUrl}/s/ideas#${result.raw.sfideaid || result.raw.sfid}`;
      } else if (result.raw.sfkbid) {
        communityUrl = `${communityBaseUrl}/s/article/${result.raw.sfurlname}`;
      }
  
      return communityUrl;
    }
}

Initialization.registerComponentFields(SalesforceCommunityResultLink.ID, fields);