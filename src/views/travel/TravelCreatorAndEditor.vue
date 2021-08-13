<template>
  <el-dialog
    small
    :visible.sync="innerVisible"
    width="640px"
    :close-on-click-modal="false"
    :title="dialogType === 'CREATE' ? '添加旅途' : '编辑旅途'"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="72px"
      :disabled="isDialogSubmitting"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="cover">
        <el-input v-model="form.cover" placeholder="请输入封面图"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onDialogCancel">取消</el-button>
      <el-button type="primary" :loading="isDialogSubmitting" @click="onDialogSubmit"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { reqCreateTrip, reqUpdateTrip, reqShowTrip } from '@/api/trips';

export default {
  name: 'TravelCreatorAndEditor',

  props: {
    isVisible: { type: Boolean, default: false },
    dialogType: { type: String, required: true },
    travelId: Number,
  },

  data() {
    return {
      innerVisible: false,
      isDialogSubmitting: false,
      form: {
        id: 0,
        title: '',
        price: '',
        cover: '',
      },
      formRules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' },
          { max: 64, message: '标题最长 64 个字符', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'blur' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '价格必须是一个最多两位小数的正数',
            trigger: 'blur',
          },
        ],
        cover: [
          { required: true, message: '请填写封面图地址', trigger: 'blur' },
          {
            pattern: /^(http(s)?:\/\/)\w+[^\s]+(\.[^\s]+){1,}$/,
            message: '封面图地址必须是一个标准的 URL',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  watch: {
    isVisible(newVal) {
      this.innerVisible = newVal;
      if (this.dialogType === 'EDIT') {
        this.initForm();
      }
    },
    innerVisible(newVal) {
      this.$emit('visible-change', newVal);

      if (!newVal) {
        this.$emit('dialog-close');
      }
    },
  },

  methods: {
    async initForm() {
      const res = await reqShowTrip(this.travelId);
      this.form.id = res.data.id;
      this.form.title = res.data.title;
      this.form.price = res.data.price / 100;
      this.form.cover = res.data.cover;
    },
    onDialogCancel() {
      this.innerVisible = false;
    },
    handleDialogClosed() {
      this.$refs.form.resetFields();
    },
    async onDialogSubmit() {
      try {
        await this.$refs.form.validate();
      } catch {
        this.$message.warning('请完善全部表单项');
        return;
      }

      try {
        this.isDialogSubmitting = true;

        const reqData = {
          title: this.form.title,
          cover: this.form.cover,
          price: Number(this.form.price) * 100,
        };
        if (this.dialogType === 'CREATE') {
          await reqCreateTrip(reqData);
        } else {
          await reqUpdateTrip(this.form.id, reqData);
        }

        this.innerVisible = false;
        // this.getTravel();
        this.$message.success(this.dialogType === 'CREATE' ? '添加成功' : '编辑成功');
        this.$emit('submit', true);
      } catch {
        this.$emit('submit', false);
      } finally {
        this.isDialogSubmitting = false;
      }
    },
  },
};
</script>
