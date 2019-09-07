namespace Utils {

  export class ObjectUtils {

    public static loadJson(fileName: string): Promise<any> {

      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', fileName, true);
        request.responseType = 'json';
        request.onload = function() {
          if (request.status === 200) {
            resolve(request.response);
          } else {
            reject(new Error(`Error loading ${fileName}: ${request.statusText}`));
          }
        }
        request.onerror = function() {
          reject(new Error(`Network error while loading ${fileName}`));
        }
        request.send();
      });
    }

    public static loadValuesIntoObject(jsonData: any, targetObject: any) {
      for (let property in jsonData) {
        targetObject[property] = jsonData[property];
      }
    }
  }
}