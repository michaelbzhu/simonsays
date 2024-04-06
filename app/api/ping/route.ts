import { NextRequest, NextResponse } from "next/server";
import mqtt from "mqtt";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const message = (formData.get("message") || "") as string; //eg blue111, on222

  try {
    const client = mqtt.connect("mqtt://test.mosquitto.org");

    client.on("connect", function () {
      // The topic and message should ideally be provided in the request body,
      // but for simplicity, we're using fixed values here.
      client.publish("esp32/commands", message, function (err) {
        if (!err) {
          console.log("nice! sent msg successfully");
        } else {
          console.log("oops, something went wrong sending the message: ", err);
        }
        client.end();
      });
    });

    return new NextResponse(JSON.stringify({ message: "success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({
        error: "some internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
