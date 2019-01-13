<template>
  <div>
    <h2>In a Modal</h2>
    <div>
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
        Launch demo modal
      </button>

      <!-- Modal -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">Modal title</h4>
            </div>
            <div class="modal-body">
              <advanced-select
                v-model="value"
                :options="options"
                :multiple="multiple"
                :search="search"
                :controls="controls"
                />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import AdvancedSelect from '@/components/AdvancedSelect.vue';

export default {
  components: {
    AdvancedSelect,
  },
  data: () => ({
    options: [
      { value: 1, text: 'One' },
      {
        label: 'Group 1',
        options: [
          { value: 3, text: 'Three' },
          { value: 4, text: 'Four' },
          { value: 5, text: 'Five' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 6, text: 'Six' },
          { value: 7, text: 'Seven', disabled: true },
          { value: 8, text: 'Eight' },
        ],
      },
    ],
    value: null,
    multiple: true,
    search: true,
    controls: true,
  }),
};
</script>
