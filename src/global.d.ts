type INIObject = {
    [group: string]: { [key: string]: string };
};

declare function loadINI(path: string): INIObject;
declare function loadJSON(path: string): ReturnType<typeof JSON.parse>;
