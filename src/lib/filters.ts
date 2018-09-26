import * as Vue from "vue/dist/vue.common.js";
import * as moment from "moment";

Vue.filter("formatDate", (date, format = "MMMM Do YYYY, h:mm:ss a") =>
  moment(date).format(format)
);

Vue.filter("currency", amount => `${parseFloat(amount).toFixed(2)}€`);

Vue.filter("currencyPDF", amount => `${parseFloat(amount).toFixed(2)}`);

Vue.filter("formatHours", minutes =>
  moment()
    .startOf("day")
    .add(minutes, "minutes")
    .format("HH:mm")
);

Vue.filter(
  "totalHours",
  minutes =>
    `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, "0")}`
);

Vue.filter("iban", value => {
  const pattern = "#### #### #### #### #### ##";
  let i = 0;

  return pattern.replace(/#/g, () => value[i++]);
});
