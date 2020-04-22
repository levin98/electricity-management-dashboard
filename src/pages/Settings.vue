<template>
  <card :header-classes="{'text-right': false}">
    <template slot="header">
      <h6 class="title d-inline">Electricity Cost Configurations</h6>
    </template>
    <form @submit.prevent>
      <base-input label="First 200 kWh (1 - 200 kWh) cost" v-model="form.first200" placeholder="RM 0.218">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the first 200 kWh (1 - 200 kWh) per month</small>
      </base-input>
      <base-input label="Next 100 kWh (201 - 300 kWh) cost" v-model="form.next100" placeholder="RM 0.334">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 100 kWh (201 - 300 kWh) per month</small>
      </base-input>
      <base-input label="Next 300 kWh (301 - 600 kWh) cost" v-model="form.next300" placeholder="RM 0.516">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 300 kWh (301 - 600 kWh) per month</small>
      </base-input>
      <base-input label="Next 300 kWh (601 - 900 kWh) cost" v-model="form.next600" placeholder="RM 0.546">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 300 kWh (601 - 900 kWh) per month</small>
      </base-input>
      <base-input label="Next kWh (901 kWh onwards) cost" v-model="form.next900" placeholder="RM 0.571">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next kWh (901 kWh onwards) per month</small>
      </base-input>
      <base-input label="Minimum monthly cost" v-model="form.mincost" placeholder="RM 3.00">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">The minimum monthly charge</small>
      </base-input>
     <base-button native-type="submit" type="primary">Save</base-button>
    </form>
</card>
</template>
<script>
import BaseInput from '@/components/Inputs/BaseInput';
import BaseButton from '@/components/BaseButton';

export default {
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      form: {
        first200: '',
        next100: '',
        next300: '',
        next600: '',
        next900: '',
        mincost: ''
      }
    }
  }
};
</script>
<style>
</style>
