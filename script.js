
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        // Only allow numbers and calculator operators
        const safeExpression = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        if (!/^[0-9+\-*/%.() ]+$/.test(safeExpression)) {
            throw new Error("Invalid expression");
        }

        // Evaluate the validated arithmetic expression
        const result = Function(
            '"use strict"; return (' + safeExpression + ')'
        )();

        if (!Number.isFinite(result)) {
            display.value = "Cannot divide by zero";
            expression = "";
            justCalculated = true;
            return;
        }

        expression = String(
            Math.round((result + Number.EPSILON) * 1e10) / 1e10
        );
        updateDisplay();
        justCalculated = true;

    } catch {
        display.value = "Error";
        expression = "";
        justCalculated = true;
    }
}

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const value = button.textContent.trim();

        if (value === "AC") {
            expression = "";
            justCalculated = false;
            updateDisplay();
            return;
        }

        if (value === "DEL") {
            if (justCalculated) {
                expression = "";
                justCalculated = false;
            } else {
                expression = expression.slice(0, -1);
            }
            updateDisplay();
            return;
        }

        if (value === "=") {
            calculate();
            return;
        }

        if (justCalculated) {
            if (/[0-9.]/.test(value)) {
                expression = "";
            }
            justCalculated = false;
        }

        expression += value;
        updateDisplay();
    });
});
