module.exports = {
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "eu-west-1",
      "eventTime": "2017-11-01T11:22:24.080Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "AWS:AIDAJ6K7DK6VAQXGPRIYC"
      },
      "requestParameters": {
        "sourceIPAddress": "10.88.195.232"
      },
      "responseElements": {
        "x-amz-request-id": "BB4EEA27215DC52A",
        "x-amz-id-2": "GSHCWYo4bZuobOvEg7roxy6s7GXWcNjXaRvc9+XHV/o/b9zVakEYt3hsslS6oqBe"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "a4907114-bce1-466d-9156-e9abc95a6170",
        "bucket": {
          "name": "timb-email",
          "ownerIdentity": {
            "principalId": "A10RCOF7CYUPGE"
          },
          "arn": "arn:aws:s3:::timb-email"
        },
        "object": {
          "key": "inbox/thiaqgnlmapi1ccb0dvb2s6f0ni8evv5ionrv081",
          "size": 4022,
          "eTag": "76188fee5b0559197d1a4b8b03982e8a",
          "sequencer": "0059F9AE70077FF160"
        }
      }
    }
  ]
}