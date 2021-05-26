import { Component, IComponentBindings, ComponentOptions, IQueryResult, IResultsComponentBindings, Initialization } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface ISalesforceCommunityResultLinkOptions extends Coveo.IResultLinkOptions {
    useAsPrintable?: boolean;
    enableUrlRewriter?: boolean;
    enableLanguage?: boolean;
    name?: string;
    hostName?: string;
    protocol?: string;
    showIdeaDetails?: boolean;
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

    public resultLinkCmp: Coveo.ResultLink;
    public uri: string;

    /**
    * The options for the component
    * @componentOptions
    */
    static options: ISalesforceCommunityResultLinkOptions = {
        enableUrlRewriter: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        enableLanguage: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        useAsPrintable: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        name: Coveo.ComponentOptions.buildStringOption({ defaultValue: '' }),
        hostName: Coveo.ComponentOptions.buildStringOption({ defaultValue: window.location.hostname }),
        protocol: Coveo.ComponentOptions.buildStringOption({ defaultValue: window.location.protocol }),
        alwaysOpenInNewWindow: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        showIdeaDetails: Coveo.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };

    constructor(public element: HTMLElement, public options: ISalesforceCommunityResultLinkOptions, public bindings: IResultsComponentBindings, public result?: IQueryResult) {
        super(element, SalesforceCommunityResultLink.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, SalesforceCommunityResultLink, options);
        this.result = result;

        if (this.options.enableUrlRewriter) {
            this.applyCommunityUrlRewriter();
        }

        if (this.options.useAsPrintable) {
            this.element.textContent = this.result.clickUri;
        }

        if (!this.options.alwaysOpenInNewWindow && window['$A'] !== undefined) {
            var self = this;
            this.options.onClick = (function (e, result) {
                e.preventDefault();
                self.navigateToUri();
            });
        }

        this.resultLinkCmp = new Coveo.ResultLink(this.element, this.options, bindings, result);
        this.uri = this.resultLinkCmp['getResultUri']();
        Coveo.$$(this.element).setAttribute('href', this.uri);
    }

    protected navigateToUri() {
        let urlEvent = window['$A'].get("e.force:navigateToURL");
        urlEvent.setParams({ "url": this.uri });
        urlEvent.fire();
    }
    protected applyCommunityUrlRewriter() {

        const communityUrl = SalesforceCommunityResultLink.getCommunityUrl(this.result, this.options);
        if (communityUrl) {
            this.setClickUri(communityUrl);
        }
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

        if (result.raw.objecttype == 'Case' || result.raw.objecttype == 'CaseComment') {
            communityUrl = `${communityBaseUrl}/s/case/${result.raw.sfcaseid || result.raw.sfcase_id__c || result.raw.sfparentid}`;
        } else if (result.raw.objecttype == 'FeedItem' || result.raw.objecttype == 'FeedComment') {
            const parentId: string = result.raw.sfparentid || '';
            const path = parentId.substr(0, 3) == '005' ? 'question' : 'feed';
            communityUrl = `${communityBaseUrl}/s/${path}/${result.raw.sffeeditemid || result.raw.sfid}`;
        } else if (result.raw.objecttype == 'CollaborationGroup') {
            communityUrl = `${communityBaseUrl}/s/group/${result.raw.sfid}`;
        } else if (result.raw.objecttype == 'ContentVersion') {
            communityUrl = `${communityBaseUrl}/s/contentdocument/${result.raw.sfcontentdocumentid}`;
        } else if (result.raw.objecttype == 'Idea' && options.showIdeaDetails) {
            communityUrl = `${communityBaseUrl}/s/idea/${(result.raw.sfideaid || result.raw.sfid)}/detail`;
        } else if (result.raw.objecttype == 'Idea') {
            communityUrl = `${communityBaseUrl}/s/idea#${(result.raw.sfideaid || result.raw.sfid)}`;
        } else if (result.raw.sfkbid) {
            communityUrl = `${communityBaseUrl}/s/article/${result.raw.sfurlname}`;
        }

        communityUrl = communityUrl && options.enableLanguage ? `${communityUrl}?language=${result.raw.sflanguage || 'en_US'}` : communityUrl;

        return communityUrl;
    }
}

Initialization.registerComponentFields(SalesforceCommunityResultLink.ID, fields);