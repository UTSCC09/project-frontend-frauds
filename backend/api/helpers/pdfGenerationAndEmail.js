import { PDFDocument } from "pdf-lib";
import fs from "fs";
import nodemailer from "nodemailer";
import config from "../../config/index.js";

// loading the receipt template pdf with data and emailing to user
const loadBookingReceipt = async (docBooking, docUser) => {
  // reading the pdf template data
  const pdfFormData = await fs.readFile(
    "../../assets/Travel Receipt Template.pdf"
  );
  const pdfDoc = await PDFDocument.load(pdfFormData);
  const form = await pdfDoc.getForm();

  // get form fields in the pdf
  const bookingNumberField = form.getTextField("Booking Number");
  const preparedForNameField = form.getTextField("Prepared for");
  const emailField = form.getTextField("Email");
  const dateField = form.getTextField("Date");
  const roundTripField = form.getCheckBox("Roundtrip");
  const currencyField = form.getTextField("Currency");
  const subTotalField = form.getTextField("Sub Total");
  const taxField = form.getTextField("Tax");
  const grandTotalField = form.getTextField("Grand Total");

  // set values to the form fields
  bookingNumberField.setText(docBooking._id.toString());
  preparedForNameField.setText(
    docUser.firstName + docUser.middleName + docUser.lastName
  );
  emailField.setText(docUser.email);
  dateField.setText(
    new Date(docBooking.createdAt).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  if (docBooking.roundTrip) roundTripField.check();
  currencyField.setText(docBooking.currency);
  subTotalField.setText(docBooking.cost.toString());
  taxField.setText((docBooking.cost * docBooking.taxRate).toString());
  grandTotalField.setText(docBooking.totalPaid.toString());

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const loadFlightTicket = async (
  docBooking,
  docUser,
  docFlight,
  isDepartureFlight
) => {
  const pdfFormData = await fs.readFile(
    "../../assets/plane-ticket-template-fillable.pdf"
  );
  const pdfDoc = await PDFDocument.load(pdfFormData);
  const form = await pdfDoc.getForm();

  const airlineField = form.getTextField("Airline Name");
  const passengerNameField = form.getTextField("Name of Passenger");
  const fromField = form.getTextField("From");
  const toField = form.getTextField("To");
  const dateField = form.getTextField("Date");
  const flightField = form.getTextField("Flight");
  const classField = form.getTextField("Class");
  const seatField = form.getTextField("Seat");

  airlineField.setText(docFlight.airlineData.name);
  passengerNameField.setText(
    docUser.firstName + docUser.middleName + docUser.lastName
  );
  fromField.setText(
    docFlight.sourceAirportData.city +
      ", " +
      docFlight.sourceAirportData.country
  );
  toField.setText(
    docFlight.destAirportData.city + ", " + docFlight.destAirportData.country
  );
  dateField.setText(
    Intl.DateTimeFormat("en", { month: "2-digit", day: "2-digit" }).format(
      docFlight.departureTime * 1000
    )
  );
  flightField.setText(docFlight.planeId);
  if (isDepartureFlight) {
    classField.setText(docBooking.departureFlight.classDescription);
    seatField.setText(
      docBooking.departureFlight.seat.x +
        "," +
        docBooking.departureFlight.seat.y
    );
  } else {
    classField.setText(docBooking.returnFlight.classDescription);
    seatField.setText(
      docBooking.returnFlight.seat.x + "," + docBooking.returnFlight.seat.y
    );
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const sendBookingEmail = async (
  email,
  receipt,
  departureFlightTicket,
  returnFlightTicket
) => {
  // create transporter for email
  let transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: true,
    auth: {
      user: config.EMAIL_AUTH_USER,
      pass: config.EMAIL_AUTH_PASSWORD,
    },
  });

  /*transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to send emails");
        }
    });*/

  if (returnFlightTicket === null) {
    let mailOptions = {
      from: config.EMAIL_AUTH_USER,
      to: email,
      subject: "Your Air Toronto Flight Booking Receipt and Ticket",
      text:
        "Hi, thank you for booking a flight with Air Toronto! Attached are your receipt for the flight booking" +
        " as well as your flight ticket, have a nice trip!",
      attachments: [
        {
          filename: "receipt.pdf",
          contentType: "application/pdf",
          content: receipt,
        },
        {
          filename: "flight ticket.pdf",
          contentType: "application/pdf",
          content: departureFlightTicket,
        },
      ],
    };
  } else {
    let mailOptions = {
      from: config.EMAIL_AUTH_USER,
      to: email,
      subject: "Your Air Toronto Flight Booking Receipt and Tickets",
      text:
        "Hi, thank you for booking your flights with Air Toronto! Attached are your receipt for the flight booking" +
        "as well as your flight tickets, have a nice trip!",
      attachments: [
        {
          filename: "receipt.pdf",
          contentType: "application/pdf",
          content: receipt,
        },
        {
          filename: "departure flight ticket.pdf",
          contentType: "application/pdf",
          content: departureFlightTicket,
        },
        {
          filename: "return flight ticket.pdf",
          contentType: "application/pdf",
          content: returnFlightTicket,
        },
      ],
    };
  }

  // send email
  let info = await transporter.sendMail(mailOptions);

  console.log("Email sent: %s", info);
};

export { loadBookingReceipt, loadFlightTicket, sendBookingEmail };
