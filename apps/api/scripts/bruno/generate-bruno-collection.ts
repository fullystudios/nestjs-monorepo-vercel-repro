import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { openApiToBruno } from "@usebruno/converters";
import { copySync } from "fs-extra";

const collectionPath = "./bruno/Repo API";

async function main() {
  try {
    const openApiSpec = await (
      await fetch("http://localhost:5502/swagger/json", {
        method: "GET",
      })
    ).json();

    const brunoCollection: Collection = await openApiToBruno(openApiSpec);

    if (existsSync(collectionPath)) {
      rmSync(collectionPath, { recursive: true });
    }

    mkdirSync(collectionPath, { recursive: true });
    writeCollection(brunoCollection);

    copySync("./scripts/bruno/environments", `${collectionPath}/environments`);
  } catch (e: unknown) {
    console.error(
      "Failed to fetch open API spec. Is Repo running locally?",
    );
    throw e;
  }
}

type Collection = {
  uid: string;
  name: string;
  version: string;
  items: Item[];
  environments: Environment[];
};

type Environment = {};

type Item = Folder | Request;

type Request = {
  uid: string;
  name: string;
  type: "http-request";
  request: {
    method: string;
    url: string;
    auth: {
      mode: string;
      bearer: string | null;
    };
    body: {
      mode: "json";
      json: string;
    };
    params: [
      {
        uid: string;
        name: string;
        value: string;
        description: string;
        enabled: boolean;
        type: "path";
      },
    ];
  };
  seq: number;
};

type Folder = {
  uid: string;
  name: string;
  type: "folder";
  root: {
    request: {
      auth: {
        mode: string;
        basic: null;
        bearer: null;
      };
    };
  };
  items: Item[];
};

function writeCollection(collection: Collection) {
  const brunoJson = createBrunoJson(collection);
  writeFileSync(`${collectionPath}/bruno.json`, brunoJson);
  writeFileSync(`${collectionPath}/collection.bru`, createCollectionFile());

  collection.items.forEach((item, i) => {
    writeItem(item, collectionPath, i + 1);
  });
}

function createBrunoJson(collection: Collection) {
  const collectionJson = {
    version: collection.version,
    name: collection.name,
    type: "collection",
    ignore: ["node_modules", ".git"],
  };

  return JSON.stringify(collectionJson, null, 2);
}

function createCollectionFile() {
  return `auth {
  mode: bearer
}

auth:bearer {
  token: {{accessToken}}
}`;
}

function writeItem(item: Item, basePath: string, seq: number) {
  if (item.type === "folder") {
    const folderFile = createFolderFile(item, seq);
    const folderName = item.name;

    mkdirSync(`${basePath}/${folderName}`);
    writeFileSync(`${basePath}/${folderName}/folder.bru`, folderFile);

    item.items.forEach((subItem, i) => {
      writeItem(subItem, `${basePath}/${folderName}`, i + 1);
    });
  } else if (item.type === "http-request") {
    const requestJson = item as Request;
    const requestFile = createRequestFile(requestJson);

    writeFileSync(`${basePath}/${item.name}.bru`, requestFile);
  }
}
function createFolderFile(folderJson: Folder, seq: number) {
  return `meta {
  name: ${folderJson.name}
  seq: ${seq}
}

auth {
  mode: ${folderJson.root.request.auth.mode}
}`;
}

function createRequestFile(requestJson: Request) {
  return `meta {
  name: ${requestJson.name}
  type: http
  seq: ${requestJson.seq}
}

${requestJson.request.method.toLowerCase()} {
  url: ${requestJson.request.url}
  body: ${requestJson.request.body.mode}
  auth: inherit
}${
    requestJson.request.params.length > 0
      ? `

params:path {
  ${requestJson.request.params.map((param) => `${param.name}:`).join("\n")}
}`
      : ""
  }${
    requestJson.request.body.mode === "json" && requestJson.request.body.json
      ? `

body:json {
  ${requestJson.request.body.json.replace(/\n/g, "\n  ")}
}`
      : ""
  }
`;
}

main();
