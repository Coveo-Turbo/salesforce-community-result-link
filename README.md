# Salesforce Community Result Link

SalesforceCommunityResultLink will change clickable URI logic to open Salesforce content (Knowledge, Chatter, ContentDocument, Collaboration Group,Idea & Case) in the context of a Salesforce Lightning Community

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/salesforce-community-result-link
```

2. Use the Component or extend it

Typescript:

```javascript
import * as SalesforceCommunityResultLink from '@coveops/salesforce-community-result-link';
```

Javascript

```javascript
const SalesforceCommunityResultLink = require('@coveops/salesforce-community-result-link');
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * as SalesforceCommunityResultLink from '@coveops/salesforce-community-result-link'
```

4. Or for quick testing, you can add the script from unpkg

```html
<script src="https://unpkg.com/@coveops/salesforce-community-result-link@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

5. Include the component in your template as follows:

Add the following markup to your template:

```html
<a class="CoveoSalesforceCommunityResultLink"></a>
```

Be sure to update the variables to have the relevant information.

## Options

The following options can be configured:

|       Option        | Required |  Type   |          Default           |                             Notes                              |
| ------------------- | -------- | ------- | -------------------------- | -------------------------------------------------------------- |
| `useAsPrintable`    | No       | boolean | `false`                    | Specifies whether to display link instead of title             |
| `enableLanguage`    | No       | boolean | `false`                    | Whether to enable Language in URL (ex: Knowledge Article)      |
| `enableUrlRewriter` | No       | boolean | `true`                     | Whether to enable url rewriting logic                          |
| `hostName`          | No       | string  | `window.location.hostname` | Specifies the host name of your Salesforce Lightning Community |
| `name`              | No       | string  | ` `                        | Specifies the name of your Salesforce Lightning Community      |
| `protocol`          | No       | string  | `window.location.protocol` | Specifies protocol for the clickable link                      |

## Extending

Extending the component can be done as follows:

```javascript
import { SalesforceCommunityResultLink, ISalesforceCommunityResultLinkOptions } from "@coveops/salesforce-community-result-link";

export interface IExtendedSalesforceCommunityResultLinkOptions extends ISalesforceCommunityResultLinkOptions {}

export class ExtendedSalesforceCommunityResultLink extends SalesforceCommunityResultLink {
    protected applyCommunityUrlRewriter():string {
        //some custom logic here
        return communityUrl;
    }
}
```

The following methods can be extended to provide additional functionalities or handle more complex use cases.

### applyCommunityUrlRewriter

```javascript
protected applyCommunityUrlRewriter():string
```

The `applyCommunityUrlRewriter` should change the clickable uri.


## Contribute

1. Clone the project
2. Build the code base: `npm run build`
3. Update the test organization ID and API Token and configure your port on the `npm serve` script in the `package.json`: `--org-id <ORG_ID> --token <ORG_KEY> --port 8080`
4. Serve the sandbox for live development `npm run serve`
