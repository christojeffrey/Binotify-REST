import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { verifyToken } from "../common/authorization";
import { errorFormatter } from "../common/errorFormatter";
import { updateSubscriptionDto } from "./subscription.dto";
const fetch = require("node-fetch");
let builder = require("xmlbuilder");
var parseString = require("xml2js").parseString;

export async function updateSubscription(req: Request, res: Response) {
  // check authorization
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized, No token provided"));
    return;
  }
  let user;
  try {
    user = verifyToken(token);
  } catch (err) {
    res.status(401).send(errorFormatter("Unauthorized, Invalid token"));
    return;
  }

  // check body
  let newSubscriptionStatus;
  const updateSubscriptionBody = plainToClass(updateSubscriptionDto, req.body);
  validate(updateSubscriptionBody, { skipMissingProperties: false }).then((errors: any) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(errors));
      return;
    }
  });
  newSubscriptionStatus = updateSubscriptionBody["status"];

  // process request
  let status;
  let message;
  const creator_id = req.params.creator_id;
  let xmlrespond = await sendXMLRequestUpdateSubscription(creator_id, user["user_id"], newSubscriptionStatus);
  ({ status, message } = xmlRespondToStatusAndMessage(xmlrespond));

  if (status == "error") {
    res.status(400).send(errorFormatter("Error, could not update subscription. " + message));
    return;
  }

  return res.status(200).send({
    id: creator_id,
    status: status,
  });
}

function xmlRespondToStatusAndMessage(xmlrespond: any) {
  // unpack xmlrespond, get status and message
  let status;
  let message;
  parseString(xmlrespond, function (err: any, result: any) {
    // console.log("status", result["S:Envelope"]["S:Body"][0]["ns2:updateSubscriptionResponse"][0]["return"][0]["status"][0]);
    status = result["S:Envelope"]["S:Body"][0]["ns2:updateSubscriptionResponse"][0]["return"][0]["status"][0];
    // get message if message exists
    if (result["S:Envelope"]["S:Body"][0]["ns2:updateSubscriptionResponse"][0]["return"][0]["message"]) {
      message = result["S:Envelope"]["S:Body"][0]["ns2:updateSubscriptionResponse"][0]["return"][0]["message"][0];
    }
  });
  return { status: status, message: message };
}

export async function sendXMLRequestUpdateSubscription(creator_id: any, user_id: any, newSubscriptionStatus: any) {
  console.log("creator_id", creator_id);
  console.log("user_id", user_id);
  // create header
  const header = {
    "Content-Type": "text/xml",
  };

  // create xml using builder
  let xml = builder
    .create("Envelope", { version: "1.0", encoding: "UTF-8" })
    .att("xmlns", "http://schemas.xmlsoap.org/soap/envelope/")
    .ele("Body")
    .ele("updateSubscription", {
      xmlns: "http://services.binotify/",
    })
    .ele("arg0", { xmlns: "" }, creator_id)
    .up()
    .ele("arg1", { xmlns: "" }, user_id)
    .up()
    .ele("arg2", { xmlns: "" }, newSubscriptionStatus)
    .end({ pretty: true });

  // print xml
  console.log("xml", xml);
  let SOAP_URL = "http://binotify_soap:8080/api/binotify";

  let data = await fetch(SOAP_URL || "", {
    method: "POST",
    headers: header,
    body: xml,
    redirect: "follow",
  })
    .then((response: any) => response.text())
    .then((result: any) => {
      console.log("result", result);
      return result;
    })
    .catch((error: any) => {
      console.log("error", error);
      return error;
    });
  return data;
}
