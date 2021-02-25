const baseUrl = process.env.REACT_APP_API_ENDPOINT;

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

enum CONSTANTS {
  TOKEN = 'token',
}

interface Link {
  icon: string | null;
  label: string;
  url: string;
}

async function createRequest<T = void>(path: string, opts: RequestInit = {}) {
  const token = window.localStorage.getItem(CONSTANTS.TOKEN);

  const init: RequestInit = {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  if (!token && init.headers) {
    // @ts-ignore
    delete init.headers['Authorization'];
  }

  const response = await fetch(`${baseUrl}/${path}`, init);

  if (!response.ok) throw new Error('failed to fetch');

  try {
    const json = await response.json();
    return json as T;
  } catch (err) {
    // empty or no json
    return;
  }
}

export async function login(username: string, password: string) {
  const response = await createRequest<{ token: string }>('authenticate', {
    method: METHODS.POST,
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response && response.token) {
    window.localStorage.setItem(CONSTANTS.TOKEN, response.token);
  }

  return response;
}

const mockDefaultResponse: GetUserResponse = {
  data: {
    OutlookToken: null,
    Mode: 'L',
    links: [
      {
        ItemName: 'Officient',
        ItemLink: 'http://selfservice.officient.io/',
      },
      {
        ItemName: 'Bamboo',
        ItemLink: 'https://bamboo.projects.foreach.be',
        ImageLink: 'bamboo.png',
      },
      {
        ItemName: 'Outlook',
        ItemLink: 'https://outlook.office.com',
        ImageLink: 'outlook.png',
      },
      {
        ItemName: 'Domain Manager',
        ItemLink: 'https://domainmanager.foreach.be',
        ImageLink: 'grid-world.png',
      },
      {
        ItemName: 'Meeting Dashboard',
        ItemLink: 'https://meeting-dashboard.foreach.be',
        ImageLink: 'meetingdashboard.png',
      },
      {
        ItemName: 'Onedrive',
        ItemLink: 'https://foreachbe-my.sharepoint.com',
        ImageLink: 'onedrive.png',
      },
      {
        ItemName: 'VPN Foreach',
        ItemLink: 'https://confluence.projects.foreach.be/display/FE/OpenVPN',
        ImageLink: 'openvpn.png',
      },
      {
        ItemName: 'Bike To Work',
        ItemLink: 'https://www.biketowork.be',
        ImageLink: 'biketowork.png',
      },
      {
        ItemName: 'Artemis',
        ItemLink: 'https://artemis.foreach.be',
        ImageLink: 'artemis.png',
      },
      {
        ItemName: 'Slack',
        ItemLink: 'https://foreach.slack.com',
        ImageLink: 'slack.png',
      },
      {
        ItemName: 'Jira',
        ItemLink: 'https://jira.projects.foreach.be',
        ImageLink: 'jira.png',
      },
      {
        ItemName: 'Confluence',
        ItemLink: 'https://confluence.projects.foreach.be',
        ImageLink: 'confluence.png',
      },
      {
        ItemName: 'Bitbucket',
        ItemLink: 'https://bitbucket.foreach.be',
        ImageLink: 'bitbucket.png',
      },
      {
        ItemName: 'Biblio',
        ItemLink: 'http://biblio.foreach.be',
        ImageLink: 'biblio.svg',
      },
      {
        ItemName: 'Car Policy',
        ItemLink: 'https://confluence.projects.foreach.be/pages/viewpage.action?pageId=60228593',
        ImageLink: 'car.png',
      },
      {
        ItemName: 'Clockify',
        ItemLink: 'https://clockify.me/tracker',
        ImageLink: 'clockify.ico',
      },
    ],
  },
};

export async function getDefaultItems() {
  const data = await parseResponse(mockDefaultResponse);
  return data.links;

  // const response = await login("test", "test");
  // if (response) {
  //   const userResponse = await getUser(response.token);

  //   if (userResponse) {
  //     return userResponse.links;
  //   }
  // }
  // return [];
}

interface LinkResponse {
  ItemName: string;
  ItemLink: string;
  ImageLink?: string | null;
}

interface GetUserResponse {
  data: {
    OutlookToken: string | null;
    Mode: 'L' | 'R';
    links: LinkResponse[];
  };
}

async function parseResponse(res: GetUserResponse) {
  const links = await Promise.all(
    res.data.links.map((l) => {
      return new Promise<{
        icon?: string;
        label: string;
        url: string;
      }>((resolve) => {
        if (!l.ImageLink) {
          return resolve({
            label: l.ItemName,
            url: l.ItemLink,
          });
        }

        import(`../icons/apps/${l.ImageLink}`).then(({ default: url }) =>
          resolve({
            icon: url,
            label: l.ItemName,
            url: l.ItemLink,
          }),
        );
      });
    }),
  );

  return {
    theme: res.data.Mode === 'L' ? 'light' : 'dark',
    outlookToken: res.data.OutlookToken,
    links,
  };
}

export async function getUser(token: string) {
  const response = await createRequest<GetUserResponse>(`users/me?token=${token}`, {
    method: METHODS.GET,
  });

  return response && parseResponse(response);
}

function mapToAPI(links: Link[]) {
  return links.map((l) => ({
    ImageLink: l.icon,
    ItemName: l.label,
    ItemLink: l.url,
  }));
}

export async function updateLinks(links: Link[]) {
  const body = JSON.stringify({
    token: window.localStorage.getItem(CONSTANTS.TOKEN),
    links: mapToAPI(links),
  });

  const response = await createRequest<GetUserResponse>(`settings/links`, {
    method: METHODS.POST,
    body,
  });

  return response && parseResponse(response);
}

export async function updateTheme(theme: 'light' | 'dark') {
  const body = JSON.stringify({
    token: window.localStorage.getItem(CONSTANTS.TOKEN),
    mode: theme === 'light' ? 'L' : 'R',
  });

  const response = await createRequest(`settings/mode`, {
    method: METHODS.POST,
    body,
  });

  return response;
}
