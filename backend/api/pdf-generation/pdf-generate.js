import { PDFDocument } from "pdf-lib";
import * as fs from "fs";
import { writeFile } from "fs/promises";

async function loadPDF(){
    const req = JSON.parse(
        "{\n" +
        "    \"airline\": \"Air Toronto\",\n" +
        "    \"passenger\": \"Ling Su\",\n" +
        "    \"fromm\": \"YYZ\",\n" +
        "    \"to\": \"insert airport name\",\n" +
        "    \"datee\": \"14/07/2022\",\n" +
        "    \"flight\": \"insert flight name\",\n" +
        "    \"classs\": \"economy\",\n" +
        "    \"seat\": \"AB-15\"\n" +
        "}"
    )

    const formPdfBytes = fs.readFile("plane-ticket-template-fillable.pdf", async (err, data) => {
        if (err) {
            return res.status(400).end("Failed to read file.");
        }
        /*res.contentType("application/pdf");
        res.send(data);*/
        const pdfDoc = await PDFDocument.load(data);
        const form = pdfDoc.getForm();

        const airlineField = form.getTextField("Airline Name");
        const passengerNameField = form.getTextField("Name of Passenger");
        const fromField = form.getTextField("From");
        const toField = form.getTextField("To");
        const dateField = form.getTextField("Date");
        const flightField = form.getTextField("Flight");
        const classField = form.getTextField("Class");
        const seatField = form.getTextField("Seat");

        airlineField.setText(req.airline);
        passengerNameField.setText(req.passenger);
        fromField.setText(req.fromm);
        toField.setText(req.to);
        dateField.setText(req.datee);
        flightField.setText(req.flight);
        classField.setText(req.classs);
        seatField.setText(req.seat);

        const pdfBytes = await pdfDoc.save();
        await writeFile("ticket.pdf", pdfBytes);
        /*res.contentType("application/pdf");
        res.send(pdfBytes);*/
    });
}

// download filled pdf to current directory
//loadPDF();